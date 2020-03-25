import React from "react";

export default function ProgressBar({ pc }) {
    return (
        <div className="progressBar">
            <div className="outer">
                <div className="inner" style={{ width: `${pc}%` }} />
            </div>
        </div>
    );
}
