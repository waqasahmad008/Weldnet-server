import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { TextField } from "@material-ui/core";
import clsx from "clsx";
import * as auth from "../../store/ducks/auth.duck";
import { login } from "../../crud/auth.crud";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [loadingButtonStyle, setLoadingButtonStyle] = useState({
    paddingRight: "2.5rem"
  });

  const enableLoading = () => {
    setLoading(true);
    setLoadingButtonStyle({ paddingRight: "3.5rem" });
  };

  const disableLoading = () => {
    setLoading(false);
    setLoadingButtonStyle({ paddingRight: "2.5rem" });
  };

  return (
    <>
    <div className="kt-login__head">
         <span className="kt-login__signup-label">
          Don't have an account yet?
        </span>
        &nbsp;&nbsp;
        <Link to="/auth/registration" className="kt-link kt-login__signup-link">
          Sign Up!
        </Link>
      </div>

      <div className="kt-login__body">
        <div className="kt-login__form">
          <div className="kt-login__title">
            <h3>
              {/* https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage */}
              <FormattedMessage id="AUTH.LOGIN.TITLE" />
            </h3>
          </div>

          <Formik
            initialValues={{
              Email: "admin@demo.com",
              Password: ""
            }}
            validate={values => {
              const errors = {};

              if (!values.Email) {
                // https://github.com/formatjs/react-intl/blob/master/docs/API.md#injection-api
                errors.Email = intl.formatMessage({
                  id: "AUTH.VALIDATION.REQUIRED_FIELD"
                });
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.Email = intl.formatMessage({
                  id: "AUTH.VALIDATION.INVALID_FIELD"
                });
              }

              if (!values.Password) {
                errors.Password = intl.formatMessage({
                  id: "AUTH.VALIDATION.REQUIRED_FIELD"
                });
              }

              //return errors;
            }}
            onSubmit={(values, { setStatus, setSubmitting }) => {
              console.log('Form Submitted');
              enableLoading();
              setTimeout(() => {
                axios.post(`${process.env.REACT_APP_API}/signin`, values)
                  .then(res => {
                    console.log(res.data);
                    if(res.data == "login success"){
                    toast.success("Loggedin successfully");
                      console.log(res.data);

                     props.history.push("/dashboard");
                    }
                    else{
                        toast.error("Invalid Login",res.data);
                    //  alert(res.data);
                      disableLoading();
                      setSubmitting(false);
                    }


                    // var accessToken = res.data;
                    // props.login(accessToken);
                  })
                  .catch(() => {
                    disableLoading();
                    setSubmitting(false);
                    setStatus(
                      intl.formatMessage({
                        id: "AUTH.VALIDATION.INVALID_LOGIN"
                      })
                    );
                  });
              }, 1000);
            }}
          >
            {({
              values,
              status,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            }) => (
              <form
                noValidate={true}
                autoComplete="off"
                className="kt-form"
                onSubmit={handleSubmit}
              >
                {status ? (
                  <div role="alert" className="alert alert-danger">
                    <div className="alert-text">{status}</div>
                  </div>
                ) : (
                  <div role="alert" className="alert alert-info">
                    <div className="alert-text">
                    <div className="alert-text">{status}Login</div>
                      {/* Use account <strong>admin@demo.com</strong> and password{" "}
                      <strong>demo</strong> to continue. */}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <TextField
                    type="email"
                    label="Email"
                    margin="normal"
                    className="kt-width-full"
                    name="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.Email}
                    helperText={touched.email && errors.email}
                    error={Boolean(touched.email && errors.email)}
                  />
                </div>

                <div className="form-group">
                  <TextField
                    type="password"
                    margin="normal"
                    label="Password"
                    className="kt-width-full"
                    name="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.Password}
                    helperText={touched.password && errors.password}
                    error={Boolean(touched.password && errors.password)}
                  />
                </div>

                <div className="kt-login__actions">
                  <Link
                    to="/auth/forgot-password"
                    className="kt-link kt-login__link-forgot"
                  >
                    <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
                  </Link>

                  <button
                    id="kt_login_signin_submit"
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loading
                      }
                    )}`}
                    style={loadingButtonStyle}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </Formik>

          <div className="kt-login__divider">
            <div className="kt-divider">
              <span />
              <span>OR</span>
              <span />
            </div>
          </div>

          <div className="kt-login__options">
            <Link to="http://facebook.com" className="btn btn-primary kt-btn">
              <i className="fab fa-facebook-f" />
              Facebook
            </Link>
            <Link to="http://twitter.com" className="btn btn-info kt-btn">
              <i className="fab fa-twitter" />
              Twitter
            </Link>
            <Link to="google.com" className="btn btn-danger kt-btn">
              <i className="fab fa-google" />
              Google
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default injectIntl(
  connect(
    null,
    auth.actions
  )(Login)
);
