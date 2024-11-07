document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cveForm");
    const resultDiv = document.getElementById("result");
    function formatDate(dateStr) {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    }
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Get the CVE ID from the input
        const cveId = document.getElementById("cve_id").value;
        const apiUrl = `https://cve-extraction.onrender.com/get_cve_info?cve_id=${cveId}`;

       
        
        // Clear any previous results
        resultDiv.innerHTML = "";
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                // Generate HTML for CVE Details
                let cveDetailsHtml = `<div class="col-md-6">
                    <h2 class="mb-4">CVE Details</h2>
                    <div class="cve-details">`;

                const cveFields = [
                    { label: "ID", key: "CVE ID" },
                    { label: "Description", key: "Description" },
                    { label: "CVSS Score", key: "CVSS Score" },
                    { label: "Published Date", key: "Published Date", isDate: true },
                    { label: "Affected Product", key: "Affected Product" },
                    { label: "Privileges Required", key: "Privileges Required" },
                    { label: "Attack Vector", key: "Attack Vector" },
                    { label: "Attack Complexity", key: "Attack Complexity" },
                    { label: "Scope", key: "Scope" },
                    { label: "Confidentiality Impact", key: "Confidentiality Impact" },
                    { label: "Integrity Impact", key: "Integrity Impact" },
                    { label: "Availability Impact", key: "Availability Impact" },
                    { label: "User Interaction", key: "User Interaction" },
                    { label: "Reference Links", key: "Reference Links" }
                ];

                cveFields.forEach(field => {
                    let value = data[field.key] || "N/A";
                         
                    if (value === "N/A") return;
                    if (field.isDate) {
                        value = formatDate(value);
                    }        
                    // Special handling for URLs
                    if (field.key === "Reference Links") {
                        value = `<div class="reference-links">${value.split(",").map(link => {
                            const url = link.trim();
                            const displayText = new URL(url).hostname;
                            return `<div><a href="${url}" target="_blank">${displayText}</a></div>`;
                        }).join("")}</div>`;
                    }
                    cveDetailsHtml += `<div class="detail"><strong>${field.label}:</strong> ${value}</div>`;
                });

                cveDetailsHtml += `</div></div>`;

                // Generate HTML for Advanced Analysis
                let analysisHtml = `<div class="col-md-6">
                    <h2 class="mb-4">Analysis</h2>
                    <div class="analysis-details">`;

                const analysisFields = [
                    { label: "Vulnerability Summary", key: "Vulnerability Summary" },
                    { label: "Technical Impact Analysis", key: "Technical Impact Analysis" },
                    { label: "Risk Assessment", key: "Risk Assessment" },
                    { label: "Exploitation Potential", key: "Exploitation Potential" },
                    { label: "Mitigation Steps", key: "Mitigation Steps" }
                ];

                // Access the "Advanced Analysis" section within the JSON data
                const analysisData = data["Advanced Analysis"] || {};
                analysisFields.forEach(field => {
                    let value = analysisData[field.key] || "N/A";
                    if (value === "N/A") return;

                    analysisHtml += `<div class="detail"><strong>${field.label}:</strong> ${value}</div>`;
                });

                analysisHtml += `</div></div>`;

                // Display the generated HTML
                resultDiv.innerHTML = `<div class="row">${cveDetailsHtml}${analysisHtml}</div>`;
            } else {
                resultDiv.innerHTML = `<p class="text-danger">Error: Unable to retrieve CVE details. Please check the CVE ID and try again.</p>`;
            }
        } catch (error) {
            resultDiv.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
        }
    });
});
