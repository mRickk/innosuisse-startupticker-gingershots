class Downloader {
    handleDownload = (data, fileName) => {
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    handleAllDownload = async (transactions, gold, rates) => {
        const report = {
            "Transactions data": transactions,
            "1 month rolling gold prices": gold,
            "Exchanges rates": rates,
        };

        this.handleDownload(report, "fullReport.json");
    };
}

export default Downloader;
