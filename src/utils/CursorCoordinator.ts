import { isSSR } from './ssr';
import { MouseTracker } from './MouseTracker';

export interface CursorSubscription {
  id: string;
  onPositionUpdate: (position: { x: number; y: number }) => void;
  onLayoutChange: () => void;
  throttleMs?: number;
}

interface CoordinatorSubscriberState {
  subscription: CursorSubscription;
  lastCallTime: number;
  timeoutId: NodeJS.Timeout | null;
}

class CursorCoordinator {
  private static instance: CursorCoordinator | null = null;
  private subscribers = new Map<string, CoordinatorSubscriberState>();
  private mouseTracker: MouseTracker;
  private isListening = false;
  private rafId: number | null = null;

  private constructor() {
    this.mouseTracker = MouseTracker.getInstance();
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
  }

  static getInstance(): CursorCoordinator {
    if (!CursorCoordinator.instance) {
      CursorCoordinator.instance = new CursorCoordinator();
    }
    return CursorCoordinator.instance;
  }

  subscribe(subscription: CursorSubscription): () => void {
    if (isSSR()) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }

    const subscriberState: CoordinatorSubscriberState = {
      subscription,
      lastCallTime: 0,
      timeoutId: null,
    };

    this.subscribers.set(subscription.id, subscriberState);
    
    // Start listening if this is the first subscriber
    if (!this.isListening) {
      this.startListening();
    }

    // Subscribe to mouse tracker for position updates
    const mouseUnsubscribe = this.mouseTracker.subscribe({
      id: `coordinator-${subscription.id}`,
      callback: (position) => {
        this.handlePositionUpdate(subscription.id, position);
      },
      throttleMs: subscription.throttleMs,
    });

    // Return combined unsubscribe function
    return () => {
      mouseUnsubscribe();
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
    
    // Listen for layout-changing events
    document.addEventListener('scroll', this.handleLayoutChange, true);
    window.addEventListener('resize', this.handleLayoutChange);
    this.isListening = true;
  }

  private stopListening(): void {
    if (!this.isListening) return;
    
    document.removeEventListener('scroll', this.handleLayoutChange, true);
    window.removeEventListener('resize', this.handleLayoutChange);
    this.isListening = false;
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private handleLayoutChange(): void {
    // Batch layout change notifications using RAF
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.notifyLayoutChange();
        this.rafId = null;
      });
    }
  }

  private notifyLayoutChange(): void {
    this.subscribers.forEach((subscriberState) => {
      subscriberState.subscription.onLayoutChange();
    });
  }

  private handlePositionUpdate(subscriptionId: string, position: { x: number; y: number }): void {
    const subscriberState = this.subscribers.get(subscriptionId);
    if (!subscriberState) return;

    subscriberState.subscription.onPositionUpdate(position);
  }

  // Cleanup method for testing
  static resetInstance(): void {
    if (CursorCoordinator.instance) {
      CursorCoordinator.instance.stopListening();
      CursorCoordinator.instance = null;
    }
  }
}

export { CursorCoordinator }; 