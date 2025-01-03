import { useState } from "react";

const Toast = ({ message }) => {
    const [show, setShow] = useState(true);
    return (
        <div id="toast-default" className={`flex items-center w-full max-w-xs p-4 text-gray-500 bg-white/30 backdrop-blur-xl rounded-lg shadow fixed top-20 right-4${show ? "" : " hidden"}`} role="alert">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 bg-red-600 rounded p-1">
                <span className="material-symbols-outlined text-white">warning</span>
            </div>
            <div className="ms-3 text-sm text-white font-normal">{message}</div>
            <button type="button" className="ms-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-white duration-300 hover:duration-300 inline-flex items-center justify-center h-8 w-8" aria-label="Close" onClick={() => setShow(false)}>
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>
    )
}

export default Toast
