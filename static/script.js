document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cveForm");
    const resultDiv = document.getElementById("result");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Get the CVE ID from the input
        const cveId = document.getElementById("cve_id").value;
        const apiUrl = `https://cors-anywhere.herokuapp.com/https://cve-extraction.onrender.com/get_cve_info?cve_id=${cveId}`;

        // Clear any previous results
        resultDiv.innerHTML = "";

        try {
            const response = await fetch(apiUrl);

            if (response.ok) {
                const data = await response.json();

                // Generate the table
                let html = `<table class="table table-bordered mt-4">
                    <thead>
                        <tr><th>Field</th><th>Details</th></tr>
                    </thead>
                    <tbody>`;
                
                // List of fields to display in the table
                const fields = [
                    "CVE ID", "Description", "CVSS Score", "Affected Components", "Affected Versions",
                    "Attack Complexity", "Attack Type", "Attack Vector", "Availability Impact", 
                    "Confidentiality Impact", "Integrity Impact", "Last Modified Date", "Mitigation Steps", 
                    "Patch URL", "Platform", "Privileges Required", "Product", "Published Date", 
                    "Reference Links", "Related Hardware", "Scope", "Security Measures", 
                    "Solution", "User Interaction", "Vendor", "Vulnerability Type", 
                    "Vulnerable Modules", "Workaround"
                ];

                // Loop over fields to create table rows
                fields.forEach(field => {
                    let value = data[field] || "N/A"; // Default to "N/A" if data is missing

                    // Special handling for URLs
                    if (field === "Patch URL" && value !== "N/A") {
                        value = `<a href="${value}" target="_blank">${value}</a>`;
                    } else if (field === "Reference Links" && value !== "N/A") {
                        value = value.split(",").map(link => `<a href="${link.trim()}" target="_blank">${link.trim()}</a>`).join("<br>");
                    }

                    html += `<tr><td><strong>${field}</strong></td><td>${value}</td></tr>`;
                });

                html += `</tbody></table>`;
                
                // Display the generated HTML table
                resultDiv.innerHTML = html;
            } else {
                resultDiv.innerHTML = `<p class="text-danger">Error: Unable to retrieve CVE details. Please check the CVE ID and try again.</p>`;
            }
        } catch (error) {
            resultDiv.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
        }
    });
});
