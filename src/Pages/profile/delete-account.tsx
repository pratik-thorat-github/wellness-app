import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteAccountButton = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    
    // Simulate account deletion process
    setTimeout(() => {
      // Clear local storage
      localStorage.clear();
      
      // Show toast notification
      toast.success("Your account has been successfully deleted. The page will refresh in 5 seconds.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Refresh page after 5 seconds
      setTimeout(() => {
          window.location.href = '/';
        //   window.location.reload();
      }, 5000);
    }, 1000); // Simulating a brief delay for the deletion process
  };

  return (
    <div>
      <button 
        onClick={() => setShowConfirmDialog(true)}
        style={{
          backgroundColor: '#dc3545',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '15px'
        }}
      >
        Delete Account
      </button>

      {showConfirmDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            maxWidth: '400px'
          }}>
            <h2>Are you sure you want to delete your account?</h2>
            <p>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '20px'}}>
              <button 
                onClick={() => setShowConfirmDialog(false)}
                style={{
                  marginRight: '10px',
                  padding: '5px 10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount} 
                disabled={isDeleting}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default DeleteAccountButton;