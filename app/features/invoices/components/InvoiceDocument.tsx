import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Invoice } from "../types";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1a1a1a",
  },
  invoiceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  infoSection: {
    flexDirection: "column",
  },
  infoLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 12,
    color: "#1a1a1a",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1a1a1a",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  detailBox: {
    width: "48%",
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  detailLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 12,
    color: "#1a1a1a",
    marginBottom: 6,
  },
  table: {
    marginTop: 20,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableColDate: {
    width: "12%",
    paddingLeft: 8,
    paddingRight: 8,
  },
  tableColDescription: {
    width: "47%",
    paddingLeft: 8,
    paddingRight: 8,
  },
  tableColASA: {
    width: "12%",
    paddingLeft: 8,
    paddingRight: 8,
  },
  tableColMBS: {
    width: "12%",
    paddingLeft: 8,
    paddingRight: 8,
  },
  tableColAmount: {
    width: "5%",
    textAlign: "right",
    paddingLeft: 8,
    paddingRight: 8,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
    textTransform: "uppercase",
  },
  tableCellText: {
    fontSize: 11,
    color: "#1a1a1a",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  totalBox: {
    width: "40%",
    backgroundColor: "#f3f4f6",
    padding: 15,
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
});

// Helper function to format date
const formatDate = (date: Date): string => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// Create Document Component
const InvoiceDocument = ({ invoice }: { invoice: Invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Customer and Doctor Details */}
      <View style={styles.detailsContainer}>
        {/* Customer Information */}
        <View style={styles.detailBox}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <Text style={styles.detailLabel}>Name</Text>
          <Text style={styles.detailValue}>{invoice.customer.name}</Text>
          <Text style={styles.detailLabel}>Date of Birth</Text>
          <Text style={styles.detailValue}>
            {formatDate(invoice.customer.dateOfBirth)}
          </Text>
        </View>

        {/* Doctor Information */}
        <View style={styles.detailBox}>
          <Text style={styles.sectionTitle}>Healthcare Provider</Text>
          <Text style={styles.detailLabel}>Physician</Text>
          <Text style={styles.detailValue}>
            Dr. {invoice.doctor.firstName} {invoice.doctor.lastName}
          </Text>
        </View>
      </View>

      {/* Line Items Table */}
      <View style={styles.table}>
        <Text style={styles.sectionTitle}>Services & Charges</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <View style={styles.tableColDate}>
            <Text style={styles.tableHeaderText}>Date</Text>
          </View>
          <View style={styles.tableColDescription}>
            <Text style={styles.tableHeaderText}>Description</Text>
          </View>
          <View style={styles.tableColASA}>
            <Text style={styles.tableHeaderText}>ASA Item</Text>
          </View>
          <View style={styles.tableColMBS}>
            <Text style={styles.tableHeaderText}>MBS Item</Text>
          </View>
          <View style={styles.tableColAmount}>
            <Text style={styles.tableHeaderText}>Amount</Text>
          </View>
        </View>

        {/* Table Rows */}
        {invoice.lineItems.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableColDate}>
              <Text style={styles.tableCellText}>{formatDate(item.date)}</Text>
            </View>
            <View style={styles.tableColDescription}>
              {item.timeUnitDescription ? (
                <View>
                  <Text style={styles.tableCellText}>{item.description}</Text>
                  <Text
                    style={[
                      styles.tableCellText,
                      { fontSize: 10, color: "#6b7280", marginTop: 2 },
                    ]}
                  >
                    {item.timeUnitDescription.timeRange}
                  </Text>
                  <Text
                    style={[
                      styles.tableCellText,
                      { fontSize: 10, color: "#6b7280", marginTop: 2 },
                    ]}
                  >
                    Units: {item.timeUnitDescription.units} |{" "}
                    {item.timeUnitDescription.durationChunk}
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.tableCellText}>{item.description}</Text>
                  {item.asaTimeUnits && (
                    <Text
                      style={[
                        styles.tableCellText,
                        { fontSize: 9, color: "#6b7280", marginTop: 2 },
                      ]}
                    >
                      Units: {item.asaTimeUnits}
                    </Text>
                  )}
                </>
              )}
            </View>
            <View style={styles.tableColASA}>
              <Text style={styles.tableCellText}>{item.asaCode || "-"}</Text>
            </View>
            <View style={styles.tableColMBS}>
              <Text style={styles.tableCellText}>{item.mbsCode || "-"}</Text>
            </View>
            <View style={styles.tableColAmount}>
              <Text style={styles.tableCellText}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={styles.totalSection}>
        <View style={styles.totalBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount Due:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.totalAmount)}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        This invoice was generated on {formatDate(new Date())} • Thank you for
        your business
      </Text>
    </Page>
  </Document>
);

export default InvoiceDocument;
