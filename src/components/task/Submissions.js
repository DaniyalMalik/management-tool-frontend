import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Avatar,
  ImageListItem,
  ImageList,
  Divider,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { AttachFile, Check, Clear } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function Submissions({ task }) {
  const { token, user } = useSelector((state) => state.user);
  const classes = useStyles();

  return (
    <>
      <Typography gutterBottom variant='h4'>
        Submissions:
      </Typography>
      <br />
      {task?.user?.length > 0 &&
        task.user.map(
          (u) =>
            u.userId._id != user._id && (
              <>
                {(u.submittedAnswer ||
                  u?.submittedImage.length > 0 ||
                  u?.submittedFile.length > 0) && (
                  <>
                    <div className={classes.alignCenter}>
                      <Avatar src={u?.userId?.imagePath}>
                        {u?.userId?.firstName?.split('')[0]}
                      </Avatar>
                      &nbsp;
                      <Typography gutterBottom>
                        {u?.userId?.firstName + ' ' + u?.userId?.lastName}
                      </Typography>
                    </div>
                    <br />
                    {u?.submittedAnswer && (
                      <Typography gutterBottom>
                        <b>Description:</b>&nbsp;
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `${u?.submittedAnswer}`,
                          }}
                        />
                      </Typography>
                    )}
                    <br />
                    <Typography gutterBottom>
                      <b>Completed: </b>
                      {u?.completed ? (
                        <Check color='primary' />
                      ) : (
                        <Clear color='primary' />
                      )}
                    </Typography>
                    <br />
                  </>
                )}
                {u?.submittedImage.length > 0 && (
                  <>
                    <Typography gutterBottom>
                      <b>Photos: </b>
                    </Typography>
                    <br />
                    <ImageList
                      style={{ width: '100%', height: '200px' }}
                      cols={3}
                      rowHeight={164}>
                      {u?.submittedImage?.map((item, key) => (
                        <ImageListItem key={key}>
                          <img
                            src={`${item}?w=164&h=164&fit=crop&auto=format`}
                            srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt='image'
                            loading='lazy'
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </>
                )}
                {u?.submittedFile.length > 0 && (
                  <>
                    <Typography gutterBottom>
                      <b>Files: </b>
                    </Typography>
                    <div
                      style={{
                        overflowY: 'scroll',
                        width: '100%',
                        height: '200px',
                      }}>
                      {u?.submittedFile?.map((item, key) => (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                          }}>
                          <Typography variant='h6'>File-{key + 1}</Typography>
                          <a
                            href={item}
                            rel='noopener noreferrer'
                            download='assighment'
                            target='_blank'>
                            <IconButton>
                              <Typography variant='body2'>
                                Download Attachment
                                <AttachFile />
                              </Typography>
                            </IconButton>
                          </a>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {u?.sumittedVideo > 0 && (
                  <>
                    <Typography gutterBottom>
                      <b>Videos: </b>
                    </Typography>
                    <br />
                    <ImageList
                      style={{ width: '100%', height: '200px' }}
                      cols={3}
                      rowHeight={164}>
                      {u?.sumittedVideo?.map((item, key) => (
                        <ImageListItem key={key}>
                          <video controls>
                            <source
                              src={`${item}?w=200&h=200&fit=crop&auto=format`}
                              srcSet={`${item}?w=200&h=200&fit=crop&auto=format&dpr=2 2x`}
                              loading='lazy'
                            />
                          </video>
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </>
                )}
                <Divider />
              </>
            ),
        )}
    </>
  );
}
