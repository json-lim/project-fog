import { PDFViewer } from "@react-pdf/renderer";
import InvoiceDocument from "./InvoiceDocument";
import { ClientOnly } from "~/components/shared/ClientOnly";
import { Invoice } from "../types";

interface InvoicePreviewProps {
  invoice: Invoice;
}

/**
 * PDF preview without browser controls.
 * PDFViewer renders the PDF directly without triggering the browser's PDF viewer.
 */
const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
  return (
    <ClientOnly
      fallback={<div className="p-4 text-center">Loading PDF preview...</div>}
    >
      <div className="relative bg-white shadow-sm overflow-auto w-full h-full flex justify-center p-8">
        <PDFViewer
          width={800}
          height={800}
          showToolbar={false}
          style={{
            border: "none",
            margin: 0,
            padding: 0,
            overflow: "hidden",
          }}
        >
          <InvoiceDocument invoice={invoice} />
        </PDFViewer>
      </div>
    </ClientOnly>
  );
};

export default InvoicePreview;
