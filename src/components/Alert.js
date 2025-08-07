import React from "react";

function Alert(props) {
  const capitalize = (word) => {
    if (word === "danger") {
      word = "error";
    }
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'danger':
        return 'fas fa-exclamation-triangle';
      case 'warning':
        return 'fas fa-exclamation-circle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-info-circle';
    }
  };

  return (
    <div style={{ 
      height: "60px",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 var(--spacing-md)'
    }}>
      {props.alert && (
        <div
          className={`alert alert-${props.alert.type}`}
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            maxWidth: '600px',
            width: '100%',
            margin: 0,
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            border: '1px solid',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <i 
            className={getAlertIcon(props.alert.type)}
            style={{
              fontSize: 'var(--text-lg)',
              flexShrink: 0
            }}
          ></i>
          
          <div style={{ flex: 1 }}>
            <strong>{capitalize(props.alert.type)}</strong>: {props.alert.msg}
          </div>

          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            backgroundColor: 'currentColor',
            opacity: 0.3,
            animation: 'shrink 3s linear forwards'
          }}></div>

          <style jsx>{`
            @keyframes shrink {
              0% { width: 100%; }
              100% { width: 0%; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default Alert;