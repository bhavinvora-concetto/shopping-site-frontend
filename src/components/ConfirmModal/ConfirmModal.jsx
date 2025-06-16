import React from "react";
import { LuLogOut } from "react-icons/lu";
import "./ConfirmModal.css";

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal shadow">
        <div className="modal-header-icon text-danger">
          <LuLogOut size={40} />
        </div>
        <p className="text-center text-secondary mb-4">
          {message || "This action cannot be undone."}
        </p>
        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button className="btn btn-danger w-100" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
