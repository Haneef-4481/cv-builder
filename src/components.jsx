import { RadioButtons } from "./customFields";
import { useState } from "react";
import jspdf from "jspdf";

const required = ["name", "email", "phone", "school-name", "title", "position"];

import { jsPDF } from "jspdf";

export function exportPDF(object, isExperienced) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let cursorY = 25;
  const margin = 20;
  const pageWidth = 210;

  // --- Header: Name & Contact ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(object.name || "Untitled Resume", margin, cursorY);

  cursorY += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const contactText = `${object.email || ""}   |   ${object.phone || ""}`;
  doc.text(contactText, margin, cursorY);

  // Divider Line
  cursorY += 6;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);

  // --- Section: Education ---
  cursorY += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text("EDUCATION", margin, cursorY);

  cursorY += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(object["school-name"] || "", margin, cursorY);

  cursorY += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const educationDetails = [
    object.title ? `Qualification / Title: ${object.title}` : "",
    object["study-date"] ? `Graduation / Date: ${object["study-date"]}` : "",
  ]
    .filter(Boolean)
    .join("  •  ");
  doc.text(educationDetails, margin, cursorY);

  // --- Section: Work Experience ---
  if (isExperienced) {
    cursorY += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text("WORK EXPERIENCE", margin, cursorY);

    cursorY += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(object.position || "", margin, cursorY);

    if (object.company) {
      cursorY += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(`Company: ${object.company}`, margin, cursorY);
    }

    const dateRange = [object["start-date"], object["end-date"]]
      .filter(Boolean)
      .join(" — ");
    if (dateRange) {
      cursorY += 5;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(dateRange, margin, cursorY);
    }
  }
  const filename = `${(object.name || "resume").toLowerCase().replace(/\s+/g, "_")}_resume.pdf`;
  doc.save(filename);
}

function Main() {
  let [disabled, setDisabled] = useState(true);
  let [values, setValues] = useState({});
  let [errors, setErrors] = useState({});

  function putInput(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function checkForErrors() {
    let obj = {};
    for (let field of required) {
      if (field === "position" && disabled) {
        obj[field] = "";
        continue;
      }
      if (!(field in values)) {
        obj[field] = `${field} is required`;
      }
    }

    if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(values["email"]) && !obj["email"]) {
      obj["email"] = "please enter a valid mail id";
    }

    if (!/^[6-9]\d{9}$/.test(values["phone"]) && !obj["phone"]) {
      obj["phone"] = "please enter a valid phone";
    }

    const startDate = new Date(values["start-date"]);
    const endDate = new Date(values["end-date"]);
    if (startDate > endDate) {
      obj["exp-date"] =
        "please enter valid dates, start date shall be before the end date";
    }
    if (Object.keys(obj).length === 0) {
      console.log(values);
      exportPDF(values, !disabled);
    }
    setErrors(obj);
  }

  return (
    <>
      <form action="">
        <h3>Details</h3>
        <p>Required fields are marked with *</p>
        <div className="fields">
          <fieldset>
            <legend>General Info</legend>
            <div className="field">
              <label htmlFor="name">Name*</label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={(e) => {
                  putInput(e);
                }}
                value={values["name"]}
              />
              <div className="message">{errors["name"]}</div>
            </div>
            <div className="field">
              <label htmlFor="email">Email-id*</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => {
                  putInput(e);
                }}
                value={values["email"]}
              />
              <div className="message">{errors["email"]}</div>
            </div>
            <div className="field">
              <label htmlFor="phone">Phone No.*</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                onChange={(e) => {
                  putInput(e);
                }}
                value={values["phone"]}
              />
              <div className="message">{errors["phone"]}</div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Educational qualifications</legend>
            <div className="field">
              <label htmlFor="school-name">School Name*</label>
              <input
                type="text"
                name="school-name"
                id="school-name"
                onChange={(e) => {
                  putInput(e);
                }}
                value={values["school-name"]}
              />
              <div className="message">{errors["school-name"]}</div>
            </div>
            <div className="field">
              <label htmlFor="title">Title*</label>
              <input
                type="text"
                name="title"
                id="title"
                onChange={(e) => {
                  putInput(e);
                }}
                value={values["title"]}
              />
              <div className="message">{errors["title"]}</div>
            </div>
            <div className="field">
              <div className="date">
                <label htmlFor="study-date">Study date</label>
                <input
                  type="date"
                  name="study-date"
                  id="study-date"
                  onChange={(e) => {
                    putInput(e);
                  }}
                  value={values["study-date"]}
                />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Experience</legend>
            <div className="field">
              <p>Do you have prior experience ?</p>
              <RadioButtons
                buttons={["yes", "no"]}
                type="question"
                callback={(val) => {
                  setDisabled(val);
                }}
              ></RadioButtons>
            </div>
            {!disabled && (
              <>
                <div className="field">
                  <label htmlFor="company">Company name</label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    onChange={(e) => {
                      putInput(e);
                    }}
                    value={values["company"]}
                  />
                  <div className="message">{errors["company"]}</div>
                </div>
                <div className="field">
                  <label htmlFor="position">Postion title*</label>
                  <input
                    type="text"
                    name="position"
                    id="position"
                    onChange={(e) => {
                      putInput(e);
                    }}
                    value={values["position"]}
                  />
                  <div className="message">{errors["position"]}</div>
                </div>
                <div className="field">
                  <div className="dates">
                    <div class="date">
                      <label htmlFor="start-date">Start date</label>
                      <input
                        type="date"
                        id="start-date"
                        name="start-date"
                        value={values["start-date"]}
                        onChange={(e) => {
                          putInput(e);
                        }}
                      />
                    </div>
                    <div class="date">
                      <label htmlFor="end-date">End date</label>
                      <input
                        type="date"
                        id="end-date"
                        name="end-date"
                        values={values["end-date"]}
                        onChange={(e) => {
                          putInput(e);
                        }}
                      />
                    </div>
                  </div>
                  <div className="message">{errors["exp-date"]}</div>
                </div>
              </>
            )}
          </fieldset>
        </div>
        <div className="submit-button">
          <button
            type="button"
            onClick={() => {
              checkForErrors();
            }}
          >
            Submit form
          </button>
        </div>
      </form>
    </>
  );
}

export { Main };
