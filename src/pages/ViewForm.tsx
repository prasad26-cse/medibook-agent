
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ArrowLeft, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewForm = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const element = document.createElement('a');
    const content = document.getElementById('intake-form')?.innerHTML || '';
    const blob = new Blob([`
      <!DOCTYPE html>
      <html>
      <head>
        <title>New Patient Intake Form</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin-bottom: 30px; }
          .section-title { font-weight: bold; font-size: 16px; margin-bottom: 15px; color: #2563eb; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .field { margin-bottom: 10px; }
          .field-label { font-weight: bold; display: inline-block; min-width: 150px; }
          .field-line { border-bottom: 1px solid #333; display: inline-block; min-width: 200px; margin-left: 10px; }
          .checkbox { margin-right: 5px; }
          .instructions { background-color: #f0f9ff; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0; }
          .signature-section { margin-top: 40px; }
          @media print { body { margin: 0; padding: 15px; } }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    element.href = url;
    element.download = 'New_Patient_Intake_Form.html';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-medical-coral/5 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto mb-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
      <Card className="max-w-4xl mx-auto bg-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-primary">New Patient Intake Form</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div id="intake-form" className="space-y-8">
            {/* Header */}
            <div className="text-center border-b-2 border-primary pb-6 mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">MediCare Allergy & Wellness Center</h1>
              <p className="text-lg text-muted-foreground">456 Healthcare Boulevard, Suite 300 | Phone: (555) 123-4567</p>
              <h2 className="text-2xl font-semibold mt-4 text-foreground">New Patient Intake Form</h2>
              <p className="text-sm text-muted-foreground mt-2">Please complete this form and bring it to your appointment or submit online 24 hours before your visit.</p>
            </div>

            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary border-b border-border pb-2">PATIENT INFORMATION</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Last Name *</label>
                  <div className="border-b border-border h-8"></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">First Name *</label>
                  <div className="border-b border-border h-8"></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Middle Initial</label>
                  <div className="border-b border-border h-8"></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Date of Birth *</label>
                  <div className="border-b border-border h-8"></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Gender *</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" /> Male
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" /> Female
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" /> Other
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Email Address *</label>
                  <div className="border-b border-border h-8"></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Home Phone</label>
                  <div className="border-b border-border h-8"></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Cell Phone *</label>
                  <div className="border-b border-border h-8"></div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-1">Street Address *</label>
                  <div className="border-b border-border h-8"></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">City *</label>
                  <div className="border-b border-border h-8"></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">State *</label>
                  <div className="border-b border-border h-8"></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">ZIP Code *</label>
                  <div className="border-b border-border h-8"></div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary border-b border-border pb-2">EMERGENCY CONTACT</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Emergency Contact Name *</label>
                  <div className="border-b border-border h-8"></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Relationship *</label>
                  <div className="border-b border-border h-8"></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Phone Number *</label>
                  <div className="border-b border-border h-8"></div>
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary border-b border-border pb-2">INSURANCE INFORMATION</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Primary Insurance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1">Insurance Company:</label>
                      <div className="border-b border-border h-8"></div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1">Member ID:</label>
                      <div className="border-b border-border h-8"></div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1">Group Number:</label>
                      <div className="border-b border-border h-8"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Secondary Insurance (if applicable)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1">Insurance Company:</label>
                      <div className="border-b border-border h-8"></div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1">Member ID:</label>
                      <div className="border-b border-border h-8"></div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1">Group Number:</label>
                      <div className="border-b border-border h-8"></div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">Note: Please bring insurance cards and photo ID to your appointment.</p>
              </div>
            </div>

            {/* Chief Complaint & Symptoms */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary border-b border-border pb-2">CHIEF COMPLAINT & SYMPTOMS</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">What is the primary reason for your visit today? *</label>
                  <div className="border border-border rounded p-3 min-h-[80px]">
                    <em className="text-muted-foreground text-sm">Please describe your main concern or symptoms...</em>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">How long have you been experiencing these symptoms?</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Less than 1 week</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> 1-4 weeks</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> 1-6 months</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> More than 6 months</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Please check all symptoms you are currently experiencing:</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Sneezing</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Runny nose</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Stuffy nose</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Itchy eyes</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Watery eyes</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Coughing</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Wheezing</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Shortness of breath</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Chest tightness</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Skin rash/hives</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Sinus pressure</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Headaches</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Allergy History */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary border-b border-border pb-2">ALLERGY HISTORY</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Do you have any known allergies? *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Yes</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> No</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Not sure</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">If yes, please list all known allergies and reactions:</label>
                  <div className="border border-border rounded p-3 min-h-[80px]">
                    <em className="text-muted-foreground text-sm">Include foods, medications, environmental allergens, etc.</em>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Have you ever had allergy testing before?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Yes - When: <div className="border-b border-border ml-2 min-w-[100px]"></div></label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> No</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Have you ever used an EpiPen or had a severe allergic reaction?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Yes</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> No</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Medications */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary border-b border-border pb-2">CURRENT MEDICATIONS</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Please list ALL current medications, vitamins, and supplements:</label>
                  <div className="border border-border rounded p-3 min-h-[120px]">
                    <em className="text-muted-foreground text-sm">Include prescription medications, over-the-counter drugs, vitamins, and herbal supplements. Include dosage if known.</em>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Are you currently taking any of these allergy medications?</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Claritin (loratadine)</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Zyrtec (cetirizine)</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Allegra (fexofenadine)</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Benadryl (diphenhydramine)</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Flonase/Nasacort (nasal sprays)</label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" /> Other: 
                      <div className="border-b border-border ml-2 min-w-[120px]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary border-b border-border pb-2">MEDICAL HISTORY</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Please check any conditions you have or have had:</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Asthma</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Eczema</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Sinus infections</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Pneumonia</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Bronchitis</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> High blood pressure</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Diabetes</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Heart disease</label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" /> Other: 
                      <div className="border-b border-border ml-2 min-w-[120px]"></div>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Family history of allergies or asthma:</label>
                  <div className="border border-border rounded p-3 min-h-[80px]">
                    <em className="text-muted-foreground text-sm">Please describe any family history of allergies, asthma, or related conditions</em>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Pre-Visit Instructions */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h3 className="text-xl font-bold text-blue-700 mb-4">IMPORTANT PRE-VISIT INSTRUCTIONS</h3>
              <div className="space-y-4">
                <p className="text-sm font-semibold text-blue-900">CRITICAL: If allergy testing is planned, you MUST stop the following medications 7 days before your appointment:</p>
                <ul className="list-disc list-inside text-sm text-blue-900 space-y-1 ml-4">
                  <li>All antihistamines (Claritin, Zyrtec, Allegra, Benadryl)</li>
                  <li>Cold medications containing antihistamines</li>
                  <li>Sleep aids like Tylenol PM</li>
                </ul>
                <p className="text-sm text-blue-900">You MAY continue: Nasal sprays (Flonase, Nasacort), asthma inhalers, and prescription medications</p>
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">I understand the pre-visit medication instructions: *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> Yes, I understand and will follow instructions</label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /> I have questions about these instructions</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Acknowledgment */}
            <div className="space-y-4 border-t-2 border-primary pt-6">
              <h3 className="text-xl font-bold text-primary border-b border-border pb-2">PATIENT ACKNOWLEDGMENT</h3>
              <p className="text-sm text-foreground">I certify that the information provided is accurate and complete to the best of my knowledge. I understand that providing false information may affect my treatment and care.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Patient Signature:</label>
                  <div className="border-b border-border h-12"></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Date:</label>
                  <div className="border-b border-border h-12"></div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
              <p className="font-semibold mb-2">For Office Use Only</p>
              <div className="flex justify-center gap-8">
                <span>Date Received: _________</span>
                <span>Staff Initial: _________</span>
                <span>Chart #: _________</span>
              </div>
              <div className="mt-4">
                <p className="font-semibold">MediCare Allergy & Wellness Center | 456 Healthcare Boulevard, Suite 300 | (555) 123-4567</p>
                <p className="mt-2">Please submit this form 24 hours before your appointment or arrive 15 minutes early if completing at the office.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewForm;
