
export const createDownloadableFile = (file: File, compressionLevel: string, outputFormat: string) => {
  // Create a valid PowerPoint XML structure
  const presentationXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst>
    <p:sldMasterId id="2147483648" r:id="rId1"/>
  </p:sldMasterIdLst>
  <p:sldIdLst>
    <p:sldId id="256" r:id="rId2"/>
  </p:sldIdLst>
  <p:sldSz cx="9144000" cy="6858000" type="screen4x3"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`;

  const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title 1"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="ctrTitle"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr/>
        <p:txBody>
          <a:bodyPr/>
          <a:lstStyle/>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" dirty="0" smtClean="0"/>
              <a:t>Converted from PDF: ${file?.name || 'Document'}</a:t>
            </a:r>
            <a:endParaRPr lang="en-US" dirty="0"/>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sld>`;

  // For simplicity, create a basic file that indicates it's a converted presentation
  const mockPptContent = `Converted from PDF: ${file?.name}\nFormat: ${outputFormat.toUpperCase()}\nCompression: ${compressionLevel}\nGenerated: ${new Date().toISOString()}\n\nThis is a mock PowerPoint file created by PDF to PPT Converter.\nFor a fully functional converter, integration with specialized libraries would be required.`;
  
  const blob = new Blob([mockPptContent], {
    type: outputFormat === 'pptx' 
      ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      : 'application/vnd.ms-powerpoint'
  });
  
  return blob;
};

export const simulateConversion = async (
  onProgress: (progress: number) => void
): Promise<void> => {
  const intervals = [10, 25, 45, 65, 80, 95, 100];
  
  for (let i = 0; i < intervals.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 800));
    onProgress(intervals[i]);
  }
};

export const calculateCompressedSize = (
  originalSize: number,
  compressionLevel: string
): number => {
  const compressionRatio = compressionLevel === 'basic' ? 0.8 : 
                          compressionLevel === 'medium' ? 0.6 : 0.4;
  return Math.floor(originalSize * compressionRatio);
};

export const formatFileSize = (bytes: number): string => {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
