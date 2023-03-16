import React, { useState, useEffect, useCallback } from "react";
import Tree from './component/tree';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useImmer } from "use-immer";
import UndoableData from "./component/undoable-data";
import FileDragAndDrop from './component/file-drag-and-drop';
import JsonViewer from './component/json-viewer'
import { parseFarmingDataToTreeData, parseTreeDataToFarmingData, validateTreeData } from "./component/data-parser";
import undoable from 'redux-undo'
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import Box from '@mui/material/Box';


// ctrl+z, ctrl+y 단축키로서 undo redo

function App() {
  const [fileName, setFileName] = useState()
  const [treeData, updateTreeData] = useImmer(new UndoableData())

  const handleUndoRedo = (event) => {
    if (event.ctrlKey && event.key === 'z') {
      updateTreeData(prevData => {
        prevData.undo()
      })
    } else if (event.ctrlKey && event.key === 'y') {
      updateTreeData(prevData => {
        prevData.redo()
      })
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleUndoRedo);
    return () => document.removeEventListener('keydown', handleUndoRedo);
  }, []);

  const onReceiveFile = (file) => {
    setFileName(file.name);
    
    const reader = new FileReader();

    reader.onload = (e) => {
      const jsonObj = JSON.parse(e.target.result);
      const treeData = parseFarmingDataToTreeData(jsonObj)
      updateTreeData(prevData => {
        prevData.setData(treeData);
      });
    }
    reader.readAsText(file, 'utf-8')
  };

  const updateTreeDataHandler = (givenTreeData) => {
    updateTreeData(prevData => {
      const func = prevData.setData.bind(prevData)
      func(validateTreeData(givenTreeData))
    })
  }
  const testUndo = () => {
    updateTreeData(prevData => {
      prevData.undo()
    })
  }
  const testPrint = () => {
    console.log(treeData.caretaker)
    treeData.caretaker.getNextMemento()
  }


  return (
    <Box height="100vh" display="flex"  flexDirection="column">
      <Box ml={2}>
        <h4>{fileName && fileName}</h4>
      </Box>
      {
        treeData.isEmpty() ?
        <FileDragAndDrop message={"json 파밍 설정 파일을 업로드하세요"} onReceiveFile={onReceiveFile}/>
        :
        <SplitPane split="vertical" minSize={500} defaultSize={1000}>
          <Pane initialSize="50%" minSize="35%">
            <Tree treeData={treeData.data} setTreeData={updateTreeDataHandler} testUndo={testUndo} testPrint={testPrint}/>
          </Pane>
          <Pane initialSize="50%" minSize="20%">
            <JsonViewer jsonObj={parseTreeDataToFarmingData(treeData.data)}/>
          </Pane>
        </SplitPane>
      }
    </Box>
  );
}
export default App;
