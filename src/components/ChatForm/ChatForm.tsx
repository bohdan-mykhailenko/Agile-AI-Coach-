import React, { useState } from 'react';
import axios from 'axios';
import {
  Grid,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { SendIcon } from '../../icons/SendIcon';
import { addMessage } from '../../reducers/messagesSlice';
import { Message } from '../../types/Message';
import { useDispatch, useSelector } from 'react-redux';
import { socketService } from '../../services/socketService';
import { selectMessages } from '../../selectors/messagesSelector';

export const ChatForm: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [inputText, setInputText] = useState('');

  const messages = useSelector(selectMessages);

  const getLastMessageId = () => {
    return messages[messages.length - 1]?.id || 0;
  };

  const isMessageInStore = (id: number | undefined) => {
    return messages.some((message) => message.id === id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputText.trim() === '') {
      return;
    }

    const messageDto = {
      role: 'user',
      content: inputText,
    };

    const newUserMessage = {
      id: getLastMessageId() + 1,
      ...messageDto,
    };

    dispatch(addMessage(newUserMessage));

    socketService.sendMessageToOpenAI(messageDto);

    setInputText('');
  };

  socketService.onOpenAIResponse((data) => {
    dispatch(addMessage(data));
  });

  return (
    <form onSubmit={handleSubmit}>
      <Grid
        container
        alignItems="center"
        margin="0 auto"
        sx={{
          width: '70%',

          [theme.breakpoints.down('lg')]: {
            width: '80%',
          },

          [theme.breakpoints.down('md')]: {
            width: '100%',
          },
        }}
      >
        <Grid
          item
          sx={{
            flex: 1,
            overflowX: 'auto',
            marginRight: '24px',

            [theme.breakpoints.down('md')]: {
              marginRight: '16px',
            },

            [theme.breakpoints.down('sm')]: {
              marginRight: '10px',
            },

            [theme.breakpoints.down('sm')]: {
              marginRight: '5px',
            },
          }}
        >
          <Typography
            variant="h4"
            color={theme.palette.gray.main}
            sx={{
              marginBottom: '12px',

              [theme.breakpoints.down('md')]: {
                marginBottom: '9px',
                fontSize: '16px',
              },

              [theme.breakpoints.down('xs')]: {
                marginBottom: '6px',

                fontSize: '14px',
              },
            }}
          >
            AgileGPT is writing...
          </Typography>
          <TextField
            type="text"
            value={inputText}
            onChange={handleInputChange}
            fullWidth
            placeholder="Ask me anything that I can help you or your team..."
            sx={{
              div: {
                border: `1px solid ${theme.palette.gray.main}`,
                borderRadius: '20px',

                '&:hover': {
                  borderColor: theme.palette.gray.dark,
                },

                '&:active': {
                  borderColor: theme.palette.black.main,
                },
              },

              input: {
                padding: '16px 20px',

                border: `1px solid ${theme.palette.gray.main}`,
                borderRadius: '20px',
                color: theme.palette.gray.dark,
                fontSize: '16px',
                fontWeight: '700',
                backgroundColor: theme.palette.white.main,

                [theme.breakpoints.down('sm')]: {
                  padding: '10px 15px',
                },

                [theme.breakpoints.down('xs')]: {
                  padding: '10px 10px',
                  fontSize: '14px',
                },
              },

              label: {
                color: theme.palette.gray.main,
                fontSize: '16px',
                fontWeight: '700',
              },
            }}
          />
        </Grid>
        <Grid item>
          <IconButton
            type="submit"
            sx={{
              svg: {
                width: '32px',
                height: '32px',

                [theme.breakpoints.down('xs')]: {
                  width: '25px',
                  height: '25px',
                },
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Grid>
      </Grid>
    </form>
  );
};
