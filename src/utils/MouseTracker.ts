import { isSSR } from './ssr';

// Types for the mouse tracker
export interface MouseSubscription {
  id: string;
  callback: (position: { x: number; y: number }) => void;
  throttleMs?: number;
}

interface SubscriberState {
  subscription: MouseSubscription;
  lastCallTime: number;
  timeoutId: NodeJS.Timeout | null;
}

class MouseTracker {
  private static instance: MouseTracker | null = null;
  private subscribers = new Map<string, SubscriberState>();
  private currentPosition: { x: number; y: number } | null = null;
  private isListening = false;
  private rafId: number | null = null;

  private constructor() {
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  static getInstance(): MouseTracker {
    if (!MouseTracker.instance) {
      MouseTracker.instance = new MouseTracker();
    }
    return MouseTracker.instance;
  }

  subscribe(subscription: MouseSubscription): () => void {
    // Skip subscription during SSR
    if (isSSR()) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {}; // No-op cleanup
    }

    const subscriberState: SubscriberState = {
      subscription,
      lastCallTime: 0,
      timeoutId: null,
    };

    this.subscribers.set(subscription.id, subscriberState);
    
    // Start listening if this is the first subscriber
    if (!this.isListening) {
      this.startListening();
    }

    // Return unsubscribe function
    return () => {
      this.unsubscribe(subscription.id);
    };
  }

  private unsubscribe(id: string): void {
    const subscriberState = this.subscribers.get(id);
    if (subscriberState?.timeoutId) {
      clearTimeout(subscriberState.timeoutId);
    }
    
    this.subscribers.delete(id);
    
    // Stop listening if no more subscribers
    if (this.subscribers.size === 0) {
      this.stopListening();
    }
  }

  private startListening(): void {
    if (this.isListening || isSSR()) return;
    
    document.addEventListener('mousemove', this.handleMouseMove);
    this.isListening = true;
  }

  private stopListening(): void {
    if (!this.isListening) return;
    
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.isListening = false;
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    const newPosition = { x: event.clientX, y: event.clientY };
    
    this.currentPosition = newPosition;
    
    // Use RAF to batch notifications for better performance
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.notifySubscribers();
        this.rafId = null;
      });
    }
  }

  private notifySubscribers(): void {
    // Don't notify if we don't have a position yet
    if (!this.currentPosition) return;
    
    const currentTime = Date.now();
    
    this.subscribers.forEach((subscriberState) => {
      const { subscription, lastCallTime, timeoutId } = subscriberState;
      const { throttleMs = 0 } = subscription;

      // Apply throttling if specified
      if (throttleMs > 0) {
        const timeSinceLastCall = currentTime - lastCallTime;
        
        if (timeSinceLastCall >= throttleMs) {
          // Call immediately
          this.callSubscriber(subscriberState);
        } else {
          // Schedule delayed call
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          
          subscriberState.timeoutId = setTimeout(() => {
            this.callSubscriber(subscriberState);
            subscriberState.timeoutId = null;
          }, throttleMs - timeSinceLastCall);
        }
      } else {
        // No throttling, call immediately
        this.callSubscriber(subscriberState);
      }
    });
  }

  private callSubscriber(subscriberState: SubscriberState): void {
    if (!this.currentPosition) return;
    
    subscriberState.subscription.callback(this.currentPosition);
    subscriberState.lastCallTime = Date.now();
  }

  // Public method to get current position (useful for initial positioning)
  getCurrentPosition(): { x: number; y: number } | null {
    return this.currentPosition ? { ...this.currentPosition } : null;
  }

  // For testing/debugging
  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  // Cleanup method for testing
  static resetInstance(): void {
    if (MouseTracker.instance) {
      MouseTracker.instance.stopListening();
      MouseTracker.instance = null;
    }
  }
}

export { MouseTracker }; 