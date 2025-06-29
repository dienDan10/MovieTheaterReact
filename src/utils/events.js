// Custom event system for application-wide events
const eventSystem = {
  // List of event handlers for different event types
  handlers: {},

  // Register a handler for an event
  on(eventName, handler) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);

    // Return an unsubscribe function
    return () => {
      this.handlers[eventName] = this.handlers[eventName].filter(
        (h) => h !== handler
      );
    };
  },

  // Trigger an event with optional data
  emit(eventName, data) {
    if (this.handlers[eventName]) {
      this.handlers[eventName].forEach((handler) => handler(data));
    }
  },
};

export default eventSystem;
