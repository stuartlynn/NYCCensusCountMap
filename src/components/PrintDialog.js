import React from "react";
import {
    PDFViewer,
    Document,
    Page,
    Text,
    View,
    StyleSheet
} from "@react-pdf/renderer";
import PDFDoc from "./PDFDoc";

export default function PrintDialog({ mapImage, onClose }) {
    return (
        <div className="print-dialog">
            <div className="inner">
                <PDFViewer style={{ width: "100%", flex: 1 }}>
                    <PDFDoc mapImage={mapImage} />
                </PDFViewer>
                <div className="buttons">
                    <button onClick={onClose}>close</button>
                </div>
            </div>
        </div>
    );
}
