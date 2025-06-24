import { isSSR } from './ssr';

// Types for the mouse tracker
export interface MouseSubscription {
  id: string;
  callback: (position: { x: number; y: number }) => void;
  containerRef?: React.RefObject<HTMLElement>;
  throttleMs?: number;
  offsetX?: number;
  offsetY?: number;
}

interface SubscriberState {
  subscription: MouseSubscription;
  lastCallTime: number;
  timeoutId: NodeJS.Timeout | null;
}

class MouseTracker {
  private static instance: MouseTracker | null = null;
  private subscribers = new Map<string, SubscriberState>();
  private currentPosition: { x: number; y: number } = { x: 0, y: 0 };
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
    this.currentPosition = { x: event.clientX, y: event.clientY };
    
    // Use RAF to batch notifications for better performance
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.notifySubscribers();
        this.rafId = null;
      });
    }
  }

  private notifySubscribers(): void {
    const currentTime = Date.now();
    
    this.subscribers.forEach((subscriberState) => {
      const { subscription, lastCallTime, timeoutId } = subscriberState;
      const { containerRef, throttleMs = 0, offsetX = 0, offsetY = 0 } = subscription;

      // Apply container bounds check if specified
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isInside = 
          this.currentPosition.x >= rect.left &&
          this.currentPosition.x <= rect.right &&
          this.currentPosition.y >= rect.top &&
          this.currentPosition.y <= rect.bottom;
          
        if (!isInside) {
          return; // Skip this subscriber if mouse is outside container
        }
      }

      // Apply throttling if specified
      if (throttleMs > 0) {
        const timeSinceLastCall = currentTime - lastCallTime;
        
        if (timeSinceLastCall >= throttleMs) {
          // Call immediately
          this.callSubscriber(subscriberState, offsetX, offsetY);
        } else {
          // Schedule delayed call
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          
          subscriberState.timeoutId = setTimeout(() => {
            this.callSubscriber(subscriberState, offsetX, offsetY);
            subscriberState.timeoutId = null;
          }, throttleMs - timeSinceLastCall);
        }
      } else {
        // No throttling, call immediately
        this.callSubscriber(subscriberState, offsetX, offsetY);
      }
    });
  }

  private callSubscriber(subscriberState: SubscriberState, offsetX: number, offsetY: number): void {
    const position = {
      x: this.currentPosition.x + offsetX,
      y: this.currentPosition.y + offsetY,
    };
    
    subscriberState.subscription.callback(position);
    subscriberState.lastCallTime = Date.now();
  }

  // Public method to get current position (useful for initial positioning)
  getCurrentPosition(): { x: number; y: number } {
    return { ...this.currentPosition };
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