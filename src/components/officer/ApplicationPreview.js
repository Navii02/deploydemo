// ApplicationFormPreviewPage.js

import React from 'react';
import ApplicationFormPreview from './ApplicationFormPreview';

function ApplicationFormPreviewPage({ formData }) {
  return (
    <div>
      {/* Add any additional styling or layout for the preview page */}
      <h1>Application Form Preview</h1>
      <ApplicationFormPreview formData={formData} />
    </div>
  );
}

export default ApplicationFormPreviewPage;
