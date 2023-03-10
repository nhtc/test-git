import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AskForSave } from 'src/components/alert/SweetAlert';
import AppButton from 'src/components/button';
import ErrorMessage from 'src/components/error-message';
import AppInput from 'src/components/input';
import CourseService from 'src/lib/api/course';
import { appActions } from 'src/lib/reducers/app/appSlice';
import { RootState } from 'src/lib/reducers/model';
import { SettingFieldData } from 'src/lib/types/commentType';
import regex from 'src/lib/utils/regularExpression';
import validation from 'src/lib/utils/validation';
import theme from 'src/styles/theme';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import { css } from '@emotion/react';

interface ContactSettingsFormProps {
  myProfile?: any;
  avatar?: string;
}
const dateFormat = 'DD/MM/YYYY';
const ContactSettingForm: React.FC<ContactSettingsFormProps> = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const myProfile = useSelector((state: RootState) => state.app.user);

  const validationSchema = React.useRef(
    Yup.object().shape({
      full_name: Yup.string().required(validation.firstName.required).matches(regex.alphabet, {
        message: 'First name cannot accept numeric and special characters.',
      }),
      email: Yup.string().required(validation.email.required),
      phone: Yup.string().required(validation.country.required).matches(regex.phoneNumberVN, {
        message: validation.phone.invalid,
      }),
    }),
  );
  const formik = useFormik<SettingFieldData>({
    initialValues: {
      ...myProfile,
      doB: '',
    },
    validationSchema: validationSchema.current,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const { full_name, email, phone } = values;
      const obj = {
        full_name: full_name,
        email: email,
        phone: phone,
        // avatar: avatar ? avatar : myProfile?.avatar,
      };
      AskForSave('L??u Thay ?????i', '', 'L??u', 'Hu???', '', async (result) => {
        if (result.isConfirmed) {
          try {
            const newInfo = await CourseService.updateInfo(phone, full_name);
            dispatch(appActions.setMyProfile(newInfo));
            Swal.fire('???? l??u thay ?????i!', '', 'success');
          } catch (error) {
            Swal.fire('???? c?? l???i x???y ra!', 'Xin th??? l???i sau', 'error');
          }
        } else if (result.isDismissed) {
          Swal.fire('Thay ?????i kh??ng ???????c l??u!', '', 'info');
        }
      });
    },
  });
  const hasError = (key: string) => {
    return Object.keys(formik.errors).length > 0 && !!formik.errors[key] && formik.touched[key];
  };

  return (
    <form
      css={css`
        display: flex;
        flex-direction: column;
        gap: 10px;
        > h2 {
          margin-top: 0px;
          margin-bottom: 10px;
          font-family: 'FiraSans', sans-serif;
          font-size: 34px;
          line-height: 36px;
          font-weight: 700;
          @media (max-width: ${theme.media.tablets}px) {
            font-size: 24px;
          }
        }
        .form-container {
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .form-item-button {
          margin-top: 10px;
        }
        .ant-picker {
          min-height: 48px;
          width: 100%;
        }
        .s-label {
          display: block;
          margin-bottom: 5px;
          font-weight: 700;
        }
        [ant-click-animating-without-extra-node='true']:after {
          display: none;
        }
      `}
      onSubmit={formik.handleSubmit}
    >
      <h2>Th??ng tin c?? nh??n</h2>
      <div className="form-container">
        <div className="form-item-full">
          <AppInput
            className="field name-field"
            label="Email"
            name="email"
            type="email"
            placeholder="Email c???a b???n"
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            value={formik.values.email}
            hasError={hasError('email')}
            readOnly
            disabled
          />
          {hasError('email') ? <ErrorMessage className="form-item-error">{formik.errors.email}</ErrorMessage> : null}
        </div>
        <div className="form-item-half">
          <AppInput
            className="field name-field"
            label="T??n"
            name="full_name"
            type="text"
            placeholder="Nh???p t??n c???a b???n"
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            value={formik.values.full_name}
            hasError={hasError('full_name')}
          />
          {hasError('full_name') ? (
            <ErrorMessage className="form-item-error">{formik.errors.full_name}</ErrorMessage>
          ) : null}
        </div>

        {/* <div className="form-item-half">
          <AppInputDate label="Ng??y sinh" placeholder="Nh???p ng??y sinh c???a b???n" dateFormat={dateFormat} isPast />
        </div> */}
        <div className="form-item-half">
          <AppInput
            className="field name-field"
            label="S??? ??i???n tho???i"
            name="phone"
            type="text"
            placeholder="S??? ??i???n tho???i"
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            value={formik.values.phone}
            hasError={hasError('phone')}
            disabled={isLoading}
          />
          {hasError('phone') ? <ErrorMessage className="form-item-error">{formik.errors.phone}</ErrorMessage> : null}
        </div>

        <div className="form-item-button">
          <AppButton
            btnTextColor="white"
            btnSize="large"
            btnStyle="solid"
            btnWidth="fix-content"
            className="btn-setting"
            type="primary"
            htmlType="submit"
            nonBordered
            bgColor=""
            // disabled={formik.isSubmitting}
          >
            L??u thay ?????i
          </AppButton>
        </div>
      </div>
    </form>
  );
};
export default ContactSettingForm;
