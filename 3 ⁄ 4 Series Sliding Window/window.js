// Function to add a row to the table
function addRow() {
  let num1 = document.getElementById("num1");
  let num2 = document.getElementById("num2");
  let operation = document.getElementById("operation").value;

  let val1 = parseFloat(num1.value);
  let val2 = parseFloat(num2.value);
  let bottom,
    top_bottom,
    handle_interlock,
    glass_length,
    glass_height,
    mesh_length,
    mesh_height,
    no_glass,
    no_mesh,
    result;
  let operationsResult = "";

  if (isNaN(val1) || isNaN(val2)) {
    alert("Please enter a valid window size.");
    return;
  }

  // Perform calculations based on selected operations
  switch (operation) {
    case "3T = 2G+1M":
      bottom = val1 - 6.5;
      top_bottom = bottom / 2;
      handle_interlock = val2 - 1.5;
      glass_length = top_bottom + 0.62;
      glass_height = val2 - 4;
      mesh_length = top_bottom + 1.6;
      mesh_height = handle_interlock - 1.4;
      no_glass = 2;
      no_mesh = 1;

      result = `Glass: ${no_glass} x (${glass_length.toFixed(
        2
      )} x ${glass_height.toFixed(
        2
      )}) | Mesh: ${no_mesh} x (${mesh_length.toFixed(
        2
      )} x ${mesh_height.toFixed(2)})`;
      operationsResult = `3T = 2G+1M`;
      break;

    case "3T = 3G":
      bottom = val1 - 8;
      top_bottom = bottom / 3;
      handle_interlock = val2 - 1.5;
      glass_length = top_bottom + 0.62;
      glass_height = val2 - 4;
      mesh_length = 0;
      mesh_height = 0;
      no_glass = 3;
      no_mesh = 0;

      result = `Glass: ${no_glass} x (${glass_length.toFixed(
        2
      )} x ${glass_height.toFixed(
        2
      )}) | Mesh: ${no_mesh} x (${mesh_length.toFixed(
        2
      )} x ${mesh_height.toFixed(2)})`;
      operationsResult = `3T = 3G`;
      break;

    default:
      result = (val1 * val2).toFixed(2); // Apply 2 decimal limit
      operationsResult = `Default Calculation: ${result}`;
      break;
  }

  // Insert new row in the table
  let tableBody = document.querySelector("#resultTable tbody");
  let newRow = document.createElement("tr");

  newRow.innerHTML = `
      <td></td>
      <td>${operationsResult}</td>
      <td>${val1.toFixed(2)}</td>
      <td>${val2.toFixed(2)}</td>
      <td>${top_bottom.toFixed(2)}</td>
      <td>${handle_interlock.toFixed(2)}</td>
      <td>${glass_length.toFixed(2)} x ${glass_height.toFixed(
    2
  )} = ${no_glass}</td>
      <td>${mesh_length.toFixed(2)} x ${mesh_height.toFixed(
    2
  )} = ${no_mesh}</td>
      <td><input type="checkbox" class="rowCheckbox"></td>
  `;

  tableBody.appendChild(newRow);
  updateSerialNumbers();

  num1.value = "";
  num2.value = "";
  num1.focus();
}

// Update serial numbers after adding or deleting rows
function updateSerialNumbers() {
  let tableRows = document.querySelectorAll("#resultTable tbody tr");
  tableRows.forEach((row, index) => {
    row.cells[0].innerText = index + 1;
  });
}

// Delete selected rows
function deleteSelectedRows() {
  let checkboxes = document.querySelectorAll(".rowCheckbox:checked");

  if (checkboxes.length === 0) {
    alert("Please select at least one row to delete.");
    return;
  }

  let confirmDelete = confirm(
    "Are you sure you want to delete the selected rows?"
  );
  if (confirmDelete) {
    checkboxes.forEach((checkbox) => {
      checkbox.closest("tr").remove();
    });
    updateSerialNumbers();
  }
}

// Focus on the next element after pressing Enter
function focusNext(event, nextElementId) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById(nextElementId).focus();
  }
}

// Prompt for PDF name and download the table as a PDF
function promptAndDownloadPDF() {
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  let currentDate = new Date();
  let day = ("0" + currentDate.getDate()).slice(-2);
  let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  let year = currentDate.getFullYear();
  let formattedDate = `${day}-${month}-${year}`;

  let name = document.getElementById("name").value.trim();
  let series = document.getElementById("series").value.trim();
  let glassType = document.getElementById("glass").value;
  let colourType = document.getElementById("colour").value;
  let customGlass = document.getElementById("custom_glass").value || glassType;
  let customColour =
    document.getElementById("custom_colour").value || colourType;

  let pdfName = `${name}_${formattedDate}_${series}`;

  let customPdfName = prompt("Enter PDF file name:", pdfName);
  if (!customPdfName) return;

  let location = document.getElementById("location").value.trim();

  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let formattedTime = `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}`;

  doc.setFontSize(24);
  doc.text("Shubham Sliding Window", 105, 16, null, null, "center");
  doc.setFontSize(12);
  doc.text(
    "Professional Sliding Window Installation Services",
    105,
    22,
    null,
    null,
    "center"
  );

  doc.setFontSize(10);
  doc.text(`Name: ${name}`, 10, 36);
  doc.text(`Address: ${location}`, 10, 44);
  doc.text(`Series: ${series} - ${customColour}`, 10, 52);
  doc.text(`Glass: ${customGlass}`, 10, 60);
  doc.text(`Date: ${formattedDate}`, 10, 68);
  doc.text(`Time: ${formattedTime}`, 10, 74);

  doc.autoTable({
    startY: 80,
    html: "#resultTable",
    columnStyles: {
      0: { halign: "center" },
      1: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "center" },
      5: { halign: "center" },
      6: { halign: "center" },
      7: { halign: "center" },
    },
    headerStyles: {
      halign: "center",
    },
    columns: [0, 1, 2, 3, 4, 5, 6, 7],
  });

  doc.save(`${customPdfName}.pdf`);
}

// Add event listener for keyboard shortcut (Ctrl + D)
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault();
    promptAndDownloadPDF();
  }
});

function toggleInputGlass() {
  var select = document.getElementById("glass");
  var input = document.getElementById("custom_glass");

  if (select.value === "Custom Glass") {
    input.style.display = "block";
  } else {
    input.style.display = "none";
  }
}
function toggleInputColour() {
  var select = document.getElementById("colour");
  var input = document.getElementById("custom_colour");

  if (select.value === "Custom Colour") {
    input.style.display = "block";
  } else {
    input.style.display = "none";
  }
}
