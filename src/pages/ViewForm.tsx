
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewForm = () => {
  const navigate = useNavigate();
  const pdfUrl = "/New Patient Intake Form.pdf";

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto mb-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>New Patient Intake Form</CardTitle>
          <a href={pdfUrl} download>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </a>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[80vh] rounded-lg overflow-hidden border">
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="New Patient Intake Form"
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewForm;
