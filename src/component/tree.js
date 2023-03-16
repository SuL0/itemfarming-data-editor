import React, { useState, useRef } from "react";
import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
  toggleExpandedForAll
} from "@nosferatu500/react-sortable-tree";
import "@nosferatu500/react-sortable-tree/style.css";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35}} >
        <Typography sx={{fontSize: 11}} color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const Tree = (props) => {
  const {treeData, setTreeData, testUndo, testPrint} = props;
  const [searchFoundCount, setSearchFoundCount] = useState(null);
  testPrint()

  const titleRef = useRef();
  const subtitleRef = useRef();

  function createNode() {
    const title = titleRef.current.value;
    const subtitle = subtitleRef.current.value;

    if (title === "") {
      titleRef.current.focus();
      return;
    }
    if (subtitle === "") {
      subtitleRef.current.focus();
      return;
    }

    let newTree = addNodeUnderParent({
      treeData: treeData,
      parentKey: null,
      expandParent: true,
      getNodeKey,
      newNode: {
        // id: "123",  필요?
        title: title,
        subtitle: `${subtitle}%`
      }
    });

    setTreeData(newTree.treeData);

    titleRef.current.value = "";
    subtitleRef.current.value = "";
  }

  function updateNode(rowInfo) {
    const { node, path } = rowInfo;
    const { children } = node;

    const title = titleRef.current.value;
    const subtitle = subtitleRef.current.value;

    if (title === "") {
      titleRef.current.focus();
      return;
    }
    if (subtitle === "") {
      subtitleRef.current.focus();
      return;
    }

    let newTree = changeNodeAtPath({
      treeData: treeData,
      path,
      getNodeKey,
      newNode: {
        children,
        title: title,
        subtitle: `${subtitle}%`
      }
    });

    setTreeData(newTree);

    titleRef.current.value = "";
    subtitleRef.current.value = "";
  }

  function addNodeChild(rowInfo) {
    let { path } = rowInfo;

    const title = titleRef.current.value;
    const subtitle = subtitleRef.current.value;

    if (title === "") {
      titleRef.current.focus();
      return;
    }
    if (subtitle === "") {
      subtitleRef.current.focus();
      return;
    }

    let newTree = addNodeUnderParent({
      treeData: treeData,
      parentKey: path[path.length - 1],
      expandParent: true,
      getNodeKey,
      newNode: {
        title: title,
        subtitle: `${subtitle}%`
      }
    });

    setTreeData(newTree.treeData);

    titleRef.current.value = "";
    subtitleRef.current.value = "";
  }

  function removeNode(rowInfo) {
    const { path } = rowInfo;
    setTreeData(
      removeNodeAtPath({
        treeData: treeData,
        path,
        getNodeKey
      })
    );
  }
  function expand(expanded) {
    setTreeData(
      toggleExpandedForAll({
        treeData: treeData,
        expanded
      })
    );
  }

  function expandAll() {
    expand(true);
  }

  function collapseAll() {
    expand(false);
  }

  const getNodeKey = ({ treeIndex }) => treeIndex;

  return (
    <div>
      <Stack pl={2} direction="row" spacing={0.3} >
        <TextField inputRef={titleRef} variant="standard" label="이름(참조용)" type="text" color="warning" defaultValue="a" focused/>
        <TextField inputRef={subtitleRef} variant="standard" label="확률(%)" type="number" color="warning" defaultValue="b" focused/>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button variant="contained" onClick={createNode}>노드 생성</Button>
          <ButtonGroup variant="contained" aria-label="outlined warning button group">
            <Button onClick={expandAll}>펼치기</Button>
            <Button onClick={collapseAll}>접기</Button>
          </ButtonGroup>
        </Box>
      </Stack>

      <div style={{ height: "100vh" }}>
        <SortableTree
          treeData={treeData}
          onChange={(treeData) => setTreeData(treeData)}
          canDrag={({ node }) => !node.dragDisabled}
          searchFinishCallback={(matches) => {
            setSearchFoundCount(matches.length);   // 의미 없는 코드이긴 한데, 왜인지 안 쓰면 크래시 떠버림
          }}
          generateNodeProps={(rowInfo) => {
            const sumOfChildrenChance = rowInfo.node.children ? rowInfo.node.children.reduce((acc, cur) => { return acc += Number(cur.subtitle.replace('%', '')) }, 0): 100
            return ({
            // title: rowInfo.node.label,
            // subtitle: rowInfo.node.subTitle,
            buttons: [
              <Stack>
                <Stack direction="row" spacing={0.3}>
                  <Button
                    variant="outlined"
                    size="small"
                    label="Child 추가"
                    onClick={(event) => addNodeChild(rowInfo)}
                  >
                    Child 추가
                  </Button>
                  <Button variant="outlined" size="small" label="수정" onClick={(event) => updateNode(rowInfo)}>
                    수정
                  </Button>
                  <Button variant="outlined" size="small" color="error" label="삭제" onClick={(event) => removeNode(rowInfo)}>
                    삭제
                  </Button>
                </Stack>
                <LinearProgressWithLabel value={sumOfChildrenChance} />
              </Stack>
            ],
            style: {
              height: "50px"
            }
          })}}
        />
      </div>
    </div>
  );
}

export default Tree;
