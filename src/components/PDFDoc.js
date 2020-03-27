import React from "react";
import {
    Image,
    Document,
    Page,
    Text,
    View,
    StyleSheet
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "white"
    },
    section: {
        margin: 0,
        padding: 0,
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center"
    }
});

// Create Document Component
export default function PDFDoc({ mapImage }) {
    console.log("map image is ", mapImage);
    const mapImageRatio = window.innerHeight / window.innerWidth;
    const height = `${Math.floor(80 * mapImageRatio)}vw`;
    return (
        <Document>
            <Page orientation="landscape" size="A4" style={styles.page}>
                <View style={styles.section}>
                    {mapImage && (
                        <Image
                            src={mapImage}
                            style={{
                                width: "80vw",
                                height: height
                            }}
                            debugg={true}
                        />
                    )}
                </View>
            </Page>
        </Document>
    );
}
