// ErrorBoundary400.js
import React from 'react';

class ErrorBoundary400 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h1>Error 400</h1>
          <p>Bad Request</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary400;
