import TextArea from 'antd/lib/input/TextArea';
import { useFormik } from 'formik';
import React, { useRef, useState } from 'react';
import AppButton from 'src/components/button';
import regex from 'src/lib/utils/regularExpression';
import validation from 'src/lib/utils/validation';
import * as Yup from 'yup';

import { css } from '@emotion/react';

interface CommentFormProps {
  onAddComment: (value) => void;
}

interface CommentProps {
  content: string;
}
const CommentForm: React.FC<CommentFormProps> = ({ onAddComment }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [focus, setFocus] = useState<boolean>(false);
  const validationSchema = React.useRef(
    Yup.object().shape({
      password: Yup.string().required(validation.password.required).matches(regex.password, {
        message: validation.password.invalidPwdRegex,
      }),
      confirmPassword: Yup.string()
        .required(validation.password.required)
        .oneOf([Yup.ref('password'), null], validation.confirmPassword.doesNotMatch),
    }),
  );
  const formik = useFormik<CommentProps>({
    initialValues: {
      content: '',
    },
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      // if (!values.content.length) {
      // 	return;
      // }
      setSubmitting(true);
      setTimeout(() => {
        formik.setFieldValue('content', '');
        onAddComment(values?.content);
        setSubmitting(false);
      }, 800);
    },
  });

  const hasError = (key: string) => {
    return Object.keys(formik.errors).length > 0 && !!formik.errors[key] && formik.touched[key];
  };
  return (
    <form
      css={css`
        .comment_box {
          textarea {
            resize: none;
          }
        }
        .btn_group {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
          position: relative;
          right: -50px;
          .ant-btn {
            font-size: 14px;
          }
        }
        .btn-cancel {
          border: none;
          margin: 10px 0;
          color: #000;
          height: 40px !important;
          box-shadow: none;

          &:hover {
            border: none;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            color: #000;
          }
        }
        .btn-cmt {
          background-color: #57a2e7 !important;
          border-color: #57a2e7 !important;
          color: #fff;
          height: 40px !important;
          width: 170px;
          &[disabled] {
            background-color: rgba(0, 0, 0, 0.05) !important;
            color: #000;
          }
          &:hover {
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            color: #000;
            font-weight: 700;
          }
        }
        [ant-click-animating-without-extra-node='true']:after {
          display: none;
        }
      `}
      className="form-wrapper"
      onSubmit={formik.handleSubmit}
    >
      <div className="form-item">
        {/* <AppInput
					className="field password-field"
					label=""
					name="content"
					type="content"
					disabled={isLoading}
					placeholder="content"
					handleChange={formik.handleChange}
					handleBlur={formik.handleBlur}
					value={formik.values.content}
					hasError={hasError('content')}
				/> */}
        <TextArea
          className="comment_box"
          name="content"
          onChange={formik.handleChange}
          value={formik.values?.content}
          placeholder="B??nh lu???n ??i???u g?? ????..."
          maxLength={500}
          showCount={true}
          allowClear={true}
          ref={(el) => {
            if (!el) return;
            inputRef.current = el;
          }}
          onFocus={() => setFocus(true)}
          // onBlur={() => setFocus(false)}
          // onPressEnter={(e) => {
          // 	e.preventDefault();
          // 	formik.handleSubmit();
          // }}
        />
        {/* {hasError('content') ? (
					<ErrorMessage>{formik.errors?.content}</ErrorMessage>
				) : null} */}
      </div>
      {focus ? (
        <div className="form-item btn_group">
          <AppButton
            btnTextColor="black"
            btnSize="large"
            btnStyle="solid"
            btnWidth="fix-content"
            className="btn-cancel"
            onClick={() => setFocus(false)}
          >
            Hu???
          </AppButton>
          <AppButton
            btnTextColor="black"
            btnSize="large"
            btnStyle="solid"
            btnWidth="fix-content"
            className="btn-cmt"
            htmlType="submit"
            loading={submitting}
            disabled={formik.values.content === ''}
          >
            B??nh lu???n
          </AppButton>
        </div>
      ) : (
        <div></div>
      )}
    </form>
  );
};

export default CommentForm;
