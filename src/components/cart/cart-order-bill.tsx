/* eslint-disable react/no-children-prop */
import { Checkbox, Col, Row } from 'antd';
import CartItemRow from '../../components/cart/cart-item';

import { Loading3QuartersOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { formatCurrencySymbol } from 'src/lib/utils/currency';
import { useEffect, useState } from 'react';
import { Course, CreateOrderArg, Document, OCart } from 'src/lib/types/backend_modal';
const antIcon = <Loading3QuartersOutlined style={{ fontSize: 40 }} spin />;
const CheckboxGroup = Checkbox.Group;
interface OrderBillProps {
  checkList: CreateOrderArg;
  cartData: OCart;
  totalPrice: number;
}
const CartOrderBill: React.FC<OrderBillProps> = ({ checkList, cartData, totalPrice }) => {
  const dispatch = useDispatch();
  const [docs, setDocs] = useState<Document[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const newDocs = cartData?.documents.filter((v) => checkList.documents.includes(v.id));
    setDocs(newDocs || []);
    const newCourses = cartData?.courses.filter((v) => checkList.courses.includes(v.id));
    setCourses(newCourses);
  }, [checkList]);

  return (
    <div className="modal-checkout-build" css={css``}>
      <Row gutter={[16, 16]} className="cart-list">
        <Col className="cart-list-item">
          {docs?.length ? (
            docs.map((v, i) => {
              return <CartItemRow document={v} key={i} isDeleteBtn={false} />;
            })
          ) : (
            <div></div>
          )}
          {courses?.length ? (
            courses.map((v, i) => {
              return <CartItemRow course={v} key={i} isDeleteBtn={false} />;
            })
          ) : (
            <div></div>
          )}
          {/* {cartData?.courses?.length ? (
            <>
              <Checkbox
                className="check-all"
                indeterminate={indeterminateCourse}
                onChange={onCheckAllChangeCourse}
                checked={checkAllCourse}
              >
                <p className="choose-all course">Ch???n t???t c??? kho?? h???c</p>
              </Checkbox>
              <Divider />
              <CheckboxGroup
                onChange={onChangeCourse}
                className="checkbox-group"
                value={checkedListCourse}
                options={cartData?.courses.map((v) => ({
                  label: <CartItemRow course={v} />,
                  value: v.id,
                  Properties: null,
                }))}
              />
            </>
          ) : (
            <></>
          )} */}
        </Col>
      </Row>
    </div>
  );
};

export default CartOrderBill;
