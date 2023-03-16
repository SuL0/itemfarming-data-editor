import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Box from '@mui/material/Box';

const customStyles = {
  borderRadius: '7px',
  height: '100%'
}


const jsonViewer = (props) => {
  const { jsonObj } = props
  return (
    <Box width="98%" height="98.5%">
      <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={customStyles}>
        { makePretty(jsonObj) }
      </SyntaxHighlighter>
    </Box>
  )
  
}


const makePretty = (jsonObj) => {
  return JSON.stringify(jsonObj,null,2);
}


export default jsonViewer