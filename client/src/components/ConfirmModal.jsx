import React from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

const ConfirmModal = ({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  variant = "danger",
}) => {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1055 }}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: 420 }}
        >
          <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
            {/* Header strip */}
            <div
              className={`bg-${variant} bg-opacity-10 px-4 pt-4 pb-3 d-flex align-items-center gap-3`}
            >
              <div
                className={`d-flex align-items-center justify-content-center rounded-circle bg-${variant} bg-opacity-15`}
                style={{ width: 48, height: 48, flexShrink: 0 }}
              >
                <FaExclamationTriangle
                  className={`text-${variant}`}
                  style={{ fontSize: 22 }}
                />
              </div>
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-0" style={{ fontSize: "1rem" }}>
                  {title || "Xác nhận"}
                </h6>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-light rounded-circle p-1 lh-1"
                onClick={onCancel}
                aria-label="Close"
                style={{ width: 30, height: 30 }}
              >
                <FaTimes style={{ fontSize: 12 }} />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 py-3">
              <p
                className="text-secondary mb-0"
                style={{ fontSize: "0.95rem", lineHeight: 1.6 }}
              >
                {message}
              </p>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light rounded-3 px-4"
                onClick={onCancel}
              >
                Hủy
              </button>
              <button
                type="button"
                className={`btn btn-${variant} rounded-3 px-4`}
                onClick={onConfirm}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
