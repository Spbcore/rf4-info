import { Button, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { auth } from '../../../../firebase';
import If from '../../../../shared/components/If';
import { UserUtils } from '../../../../shared/utils/user.utils';
import { useAppStateValue } from '../../../../state/AppStateProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    padding: '50px',
  },
  formField: {
    marginTop: '15px',
  },
  submitBtn: {
    marginTop: '30px',
    width: 'fit-content',
  },
});

interface LoginFormProps {
  register: boolean;
  onComplete: () => void;
}

const LoginForm: React.FC<LoginFormProps> = (props) => {
  const [, dispatch] = useAppStateValue();
  const [{ isMobile }] = useAppStateValue();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const classes = useStyles();

  const login = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        props.onComplete();
      })
      .catch((error) => alert(error.message));
  };

  const register = () => {
    if (!userName) {
      return;
    }
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((auth) => {
        auth.user
          ?.updateProfile({
            displayName: userName,
          })
          .then(() => {
            if (auth.user) {
              dispatch({
                type: 'SET_USER',
                payload: { user: UserUtils.parseUserData(auth.user) },
              });
            }
            props.onComplete();
          })
          .catch((error) => alert(error.message));
      })
      .catch((error) => alert(error.message));
  };

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();

    if (props.register) {
      register();
    } else {
      login();
    }
  };

  return (
    <div className={classes.root}>
      <If condition={!isMobile}>
        <img src="/assets/login_picture.jpg" alt="login" width="313px"></img>
      </If>
      <div className={classes.loginForm}>
        {props.register ? <h1>Регистрация</h1> : <h1>Вход</h1>}

        <form>
          <If condition={props.register}>
            <TextField
              required
              className={classes.formField}
              name="name"
              label="Имя пользователя"
              fullWidth={true}
              onChange={(event) => setUserName(event.target.value)}
            />
          </If>

          <TextField
            required
            className={classes.formField}
            name="email"
            label="Электронная почта"
            fullWidth={true}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            required
            className={classes.formField}
            name="password"
            label="Пароль"
            fullWidth={true}
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </form>

        <Button type="submit" className={classes.submitBtn} variant="contained" onClick={handleSubmit}>
          {props.register ? <>Зарегистрироваться</> : <>Войти</>}
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
