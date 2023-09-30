import React, { useEffect, useState, useRef } from 'react';
import { Redirect, useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import moment from 'moment';
import midString from '../../ordering/ordering';
import { updateCardByIdPatch } from '../../actions/actionCreators/cardActions';
import {
  createNewList,
  updateListById,
} from '../../actions/actionCreators/listActions';
import {
  createNewActivity,
  deleteActivityById,
} from '../../actions/actionCreators/activityActions';
import {
  fetchBoardById,
  fetchListsFromBoard,
  fetchCardsFromBoard,
  fetchActivitiesFromBoard,
} from '../../actions/actionCreators/boardActions';
import InputCard from '../card/InputCard';
import BoardHeader from './BoardHeader';
import List from '../list/List';
import AddItem from '../AddItem';
import AppBarDrawer from '../headers/AppBarDrawer';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '100%',
    minHeight: '100vh',
    scrollBehavior: 'smooth',
    width: 'fit-content',
  },
  listContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    height: '100vh',
    scrollBehavior: 'smooth',
    whiteSpace: 'nowrap',
    overflowX: 'scroll',
    padding: '20px',
  },
  editable: {
    marginLeft: theme.spacing(1),
    height: '38px',
    padding: theme.spacing(0, 1, 0, 1),
    boxShadow: 'inset 0 0 0 2px #0079bf',
    borderRadius: 6,
    backgroundColor: '#EBECF0',
    width: '290px',
    position: 'fixed',
  },
  styledAnchor: {
    textDecoration: 'none',
    color: 'black',
  },
  add: {
    textTransform: 'none',
    margin: theme.spacing(0.2, 1, 1, 1),
    justifyContent: 'left',
    opacity: 0.8,
    fontWeight: 'bold',
    backgroundColor: 'hsla(0,0%,100%,.24)',
    '&:hover': {
      opacity: 1,
      backgroundColor: 'rgba(9,30,66,.08)',
    },
    textShadow: '2px 2px black',
  },
  width: {
    width: '123px',
    color: 'white',
  },
  anchorBackward: {
    position: 'absolute',
    left: '-80px',
    transition: '0.3s',
    padding: '10px',
    width: '100px',
    textDecoration: 'none',
    color: 'white',
    borderRadius: '0 5px 5px 0',
    '&:hover': {
      left: '0',
    },
  },
  anchorForward: {
    position: 'absolute',
    right: '-80px',
    transition: '0.3s',
    padding: '10px',
    width: '100px',
    textDecoration: 'none',
    color: 'white',
    borderRadius: '5px 0 0 5px',
    '&:hover': {
      right: '0',
    },
  },
  arrowBackward: {
    top: '70%',
    backgroundColor: '#191919',
  },
  arrowForward: {
    top: '70%',
    textAlign: 'right',
    backgroundColor: '#191919',
  },
  search: {
    zIndex: '100',
    position: 'fixed',
    top: '1%',
    left: '20%',
  },
  manageBudget: {
    color: '#ffffff',
    paddingLeft: '10px',
    opacity: 0.8,
    cursor: 'pointer',
  },
  budgetTextfield: {
    backgroundColor: '#ffffff',
  },
  wrapper: {
    marginTop: '4px',
  },
}));

export default function Board() {
  const classes = useStyles();
  /* eslint-disable-next-line */
  var { id, name } = useParams();
  const { loading, currBoard, error } = useSelector((state) => state.boards);
  const { listLoading, lists } = useSelector((state) => state.lists);
  const { cardLoading, cards } = useSelector((state) => state.cards);
  const { isValid, user, token, tokenRequest } = useSelector(
    (state) => state.user,
  );
  const [initialData, setInitialData] = useState({});
  const [initDone, setInitDone] = useState(false);
  const addFlag = useRef(true);
  const { activities } = useSelector((state) => state.activities);
  const [addListFlag, setAddListFlag] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [color, setColor] = useState('white');
  const [url, setUrl] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [isBoardEditor, setIsBoardEditor] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [boardLists, setBoardLists] = useState([]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const getResponse = async () => {
    let token = localStorage.getItem('bizstruc-token');

    if (!token) {
      localStorage.removeItem('bizstruc-token');

      token = '';

      return history.push('/');
    }
  };

  useEffect(() => {
    getResponse();
  }, []);

  useEffect(() => {
    user &&
      currBoard.user &&
      currBoard.user.map((u) => {
        if (u?.userId?._id === user?._id) {
          if (u?.role === 'Editor' || u?.role === 'Admin') {
            setIsBoardEditor(true);
          } else {
            setIsBoardEditor(false);
          }
        }
        return;
      });
  }, [user, currBoard, activities, cards, lists]);

  if (!loading && name !== currBoard.name && currBoard.name !== undefined)
    name = currBoard.name;
  else if (name === undefined) name = '';

  useEffect(() => {
    if (
      (isValid && !error && refresh & token) ||
      (isValid &&
        token &&
        !error &&
        !currBoard?._id &&
        !lists.length > 0 &&
        !cards.length > 0)
    ) {
      if (id.length === 24) {
        dispatch(fetchBoardById(id, token));
        dispatch(fetchListsFromBoard(id, token));
        dispatch(fetchCardsFromBoard(id, token));
        dispatch(fetchActivitiesFromBoard(id, token));
      }
    } else {
      return;
    }
  }, [dispatch, id, isValid, token, error, refresh]);

  const componentUpdated = (e) => {
    setRefresh(true);
  };

  useEffect(() => {
    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    if (!_.isEmpty(currBoard)) {
      setColor(currBoard.image.color);
      setUrl(currBoard?.image?.full);
      // setUrl(`/uploads/${user._id}/board/${currBoard?.image?.full}`)
    }
  }, [currBoard]);

  useEffect(() => {
    if (!listLoading && !cardLoading) {
      const prevState = { tasks: {}, columns: {}, columnOrder: [] };
      // eslint-disable-next-line no-shadow
      const getTaskIds = (id) => {
        const filteredTasks = _.filter(cards, { listId: id });
        const sortedTasks = _.orderBy(filteredTasks, ['order'], ['asc']);
        const taskIds = [];
        sortedTasks.forEach((task) => taskIds.push(task._id));
        return taskIds;
      };

      const setContent = () => {
        cards.forEach((card) => (prevState.tasks[card._id] = card));
        const sortedLists = _.orderBy(lists, ['order'], ['asc']);
        sortedLists.forEach((list) => {
          prevState.columns[list._id] = {
            ...list,
            taskIds: getTaskIds(list._id),
          };
          prevState.columnOrder.push(list._id);
        });
      };
      setContent();
      setInitialData({ ...prevState });
      setInitDone(true);
    }
  }, [setInitDone, listLoading, cardLoading, setInitialData, cards, lists]);

  useEffect(() => {
    let temp = [];

    lists.map((list, key) => temp.push({ index: key, ...list }));

    setBoardLists(temp);
  }, [lists]);

  const options = boardLists.map((option) => {
    const firstLetter = option.name[0].toUpperCase();

    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });

  const onDragEnd = (result) => {
    // eslint-disable-next-line no-var
    var newOrder;
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === 'list') {
      const listOrder = initialData.columnOrder;
      if (destination.index === 0) {
        newOrder = midString('', initialData.columns[listOrder[0]].order);
      } else if (destination.index === listOrder.length - 1) {
        newOrder = midString(
          initialData.columns[listOrder[destination.index]].order,
          '',
        );
      } else if (destination.index < source.index) {
        newOrder = midString(
          initialData.columns[listOrder[destination.index - 1]].order,
          initialData.columns[listOrder[destination.index]].order,
        );
      } else {
        newOrder = midString(
          initialData.columns[listOrder[destination.index]].order,
          initialData.columns[listOrder[destination.index + 1]].order,
        );
      }
      dispatch(updateListById(draggableId, { order: newOrder }, token));
      const newListOrder = Array.from(initialData.columnOrder);
      const destinationColumn = initialData.columns[draggableId];
      destinationColumn.order = newOrder;
      newListOrder.splice(source.index, 1);
      newListOrder.splice(destination.index, 0, draggableId);
      const newData = {
        ...initialData,
        columnOrder: newListOrder,
        columns: {
          ...initialData.columns,
          draggableId: destinationColumn,
        },
      };
      setInitialData(newData);
      return;
    }
    const startList = initialData.columns[source.droppableId];
    const endList = initialData.columns[destination.droppableId];

    if (startList === endList) {
      const column = startList;
      if (destination.index === 0)
        newOrder = midString('', initialData.tasks[column.taskIds[0]].order);
      else if (destination.index === column.taskIds.length - 1)
        newOrder = midString(
          initialData.tasks[column.taskIds[destination.index]].order,
          '',
        );
      else if (destination.index < source.index)
        newOrder = midString(
          initialData.tasks[column.taskIds[destination.index - 1]].order,
          initialData.tasks[column.taskIds[destination.index]].order,
        );
      else
        newOrder = midString(
          initialData.tasks[column.taskIds[destination.index]].order,
          initialData.tasks[column.taskIds[destination.index + 1]].order,
        );

      dispatch(updateCardByIdPatch(draggableId, { order: newOrder }, token));
      const newTaskIds = Array.from(column.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const destinationTask = initialData.tasks[draggableId];
      destinationTask.order = newOrder;
      const newColumn = {
        ...column,
        taskIds: newTaskIds,
      };
      const newData = {
        ...initialData,
        columns: {
          ...initialData.columns,
          [newColumn._id]: newColumn,
        },
        tasks: {
          ...initialData.tasks,
          draggableId: destinationTask,
        },
      };
      setInitialData(newData);
      return;
    }

    // Move from one list to another
    if (endList.taskIds.length === 0) newOrder = 'n';
    else if (destination.index === 0) {
      newOrder = midString('', initialData.tasks[endList.taskIds[0]].order);
    } else if (destination.index === endList.taskIds.length)
      newOrder = midString(
        initialData.tasks[endList.taskIds[destination.index - 1]].order,
        '',
      );
    else
      newOrder = midString(
        initialData.tasks[endList.taskIds[destination.index - 1]].order,
        initialData.tasks[endList.taskIds[destination.index]].order,
      );
    dispatch(
      updateCardByIdPatch(
        draggableId,
        {
          order: newOrder,
          listId: endList._id,
        },
        token,
      ),
    );
    const text = `${user?.firstName + ' ' + user?.lastName} moved ${
      initialData.tasks[draggableId].name
    } from ${startList.name} to ${endList.name}`;
    const recentActivity = activities[activities.length - 1];

    if (
      recentActivity?.text ===
        `${user.firstName + ' ' + user.lastName} moved ${
          initialData.tasks[draggableId].name
        } from ${endList.name} to ${startList?.name}` &&
      moment(recentActivity?.createdAt).fromNow().includes('second')
    ) {
      dispatch(deleteActivityById(recentActivity?._id, token));
    } else dispatch(createNewActivity({ text, boardId: currBoard._id }, token));

    const startTaskIds = Array.from(startList.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartList = {
      ...startList,
      taskIds: startTaskIds,
    };
    const destinationTask = initialData.tasks[draggableId];
    destinationTask.order = newOrder;
    const endTaskIds = Array.from(endList.taskIds);
    endTaskIds.splice(destination.index, 0, draggableId);
    const newEndList = {
      ...endList,
      taskIds: endTaskIds,
    };
    const newData = {
      ...initialData,
      columns: {
        ...initialData.columns,
        [newStartList._id]: newStartList,
        [newEndList._id]: newEndList,
      },
      tasks: {
        ...initialData.tasks,
        draggableId: destinationTask,
      },
    };
    setInitialData(newData);
  };

  if (id.length < 24) return <h1>Invalid URL</h1>;

  const handleChange = (e) => {
    e.preventDefault();
    setListTitle(e.target.value);
  };

  const submitHandler = () => {
    if (listTitle === '') return;

    const text = listTitle.trim().replace(/\s+/g, ' ');

    if (text === '') {
      setListTitle(listTitle);
      return;
    }

    const totalLists = initialData.columnOrder.length;
    const postListReq = {
      name: text,
      user: currBoard.user,
      companyId: user?.companyId ? user.companyId : user.employId,
      boardId: currBoard._id,
      order:
        totalLists === 0
          ? 'n'
          : midString(
              initialData.columns[initialData.columnOrder[totalLists - 1]]
                .order,
              '',
            ),
    };

    postListReq.user[0].role = 'Editor';

    dispatch(createNewList(postListReq, token));
    dispatch(
      createNewActivity(
        {
          text: `${
            user?.firstName + ' ' + user?.lastName
          } added ${listTitle} to this board`,
          boardId: currBoard._id,
        },
        token,
      ),
    );
    setListTitle('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitHandler();
    }
  };

  const closeButtonHandler = () => {
    setAddListFlag(false);
    addFlag.current = true;
    setListTitle('');
  };

  const handleAddition = () => {
    setAddListFlag(true);
    addFlag.current = false;
  };

  return (
    <AppBarDrawer
      component={
        <>
          {(isValid || tokenRequest) && (
            <div
              className={classes.root}
              style={{
                backgroundColor: `${color}`,
                backgroundImage: `url(${url})`,
                backgroundSize: 'cover',
              }}>
              <Redirect to={`/board/${id}/${name}`} />
              <BoardHeader
                title={currBoard?.name}
                componentUpdated={componentUpdated}
              />
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                  isDropDisabled={!isBoardEditor}
                  droppableId='all-columns'
                  direction='horizontal'
                  type='list'>
                  {(provided) => (
                    <div
                      className={classes.listContainer}
                      {...provided.droppableProps}
                      ref={provided.innerRef}>
                      {initDone &&
                        initialData.columnOrder.map((columnId, index) => {
                          const column = initialData.columns[columnId];
                          const tasks = column.taskIds.map(
                            (taskId, key) => initialData.tasks[taskId],
                          );

                          return (
                            <List
                              key={column._id}
                              column={column}
                              currentBoard={currBoard}
                              tasks={tasks}
                              updated={componentUpdated}
                              index={index}
                            />
                          );
                        })}
                      <div className={classes.wrapper}>
                        {currBoard?.type === 'Custom' && isBoardEditor && (
                          <AddItem
                            handleClick={handleAddition}
                            btnText='Add another list'
                            type='list'
                            icon={<Add />}
                            width='256px'
                            color='white'
                          />
                        )}
                        {addListFlag && (
                          <InputCard
                            value={listTitle}
                            changedHandler={handleChange}
                            itemAdded={submitHandler}
                            closeHandler={closeButtonHandler}
                            keyDownHandler={handleKeyDown}
                            type='list'
                            btnText='Add List'
                            placeholder='Enter list title...'
                            width='230px'
                            marginLeft='1'
                          />
                        )}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}
        </>
      }
    />
  );
}
