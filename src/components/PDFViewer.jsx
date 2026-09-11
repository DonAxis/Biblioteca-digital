import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

// Versión debe coincidir exactamente con pdfjs-dist instalado (ver package.json)
const PDFJS_VERSION = '3.11.174'

export const PDFViewer = ({ fileUrl }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  return (
    <div style={{ height: '750px' }} className="border border-gray-300 rounded-lg overflow-hidden">
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`}>
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  )
}
