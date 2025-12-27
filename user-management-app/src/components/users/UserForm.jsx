import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { createUser, updateUser } from '../../redux/actions/usersActions';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;

  span {
    color: #e74c3c;
    margin-right: 4px;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid ${(props) => (props.$error ? '#e74c3c' : '#ddd')};
  border-radius: 6px;
  outline: none;
  transition: all 0.3s;
  background-color: #f8f9fa;

  &:focus {
    border-color: ${(props) => (props.$error ? '#e74c3c' : '#4a90e2')};
    background-color: white;
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$error ? 'rgba(231, 76, 60, 0.1)' : 'rgba(74, 144, 226, 0.1)'};
  }

  &::placeholder {
    color: #aaa;
  }
`;

const ErrorText = styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const Button = styled.button`
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CancelButton = styled(Button)`
  background: #f5f5f5;
  color: #666;

  &:hover:not(:disabled) {
    background: #e8e8e8;
  }
`;

const SubmitButton = styled(Button)`
  background: #4a90e2;
  color: white;

  &:hover:not(:disabled) {
    background: #357abd;
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const UserForm = ({ user, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateURL = (url) => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'first_name':
        if (!value.trim()) {
          error = 'First name is required';
        } else if (value.trim().length < 2) {
          error = 'First name must be at least 2 characters';
        }
        break;
      case 'last_name':
        if (!value.trim()) {
          error = 'Last name is required';
        } else if (value.trim().length < 2) {
          error = 'Last name must be at least 2 characters';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!validateEmail(value)) {
          error = 'Invalid email format';
        }
        break;
      case 'avatar':
        if (!value.trim()) {
          error = 'Profile image link is required';
        } else if (!validateURL(value)) {
          error = 'Invalid URL format';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      first_name: true,
      last_name: true,
      email: true,
      avatar: true,
    });

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      let result;
      if (user) {
        result = await dispatch(updateUser(user.id, formData));
      } else {
        result = await dispatch(createUser(formData));
      }

      if (result.success) {
        onSuccess();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>
          <span>*</span> First Name
        </Label>
        <Input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Please enter first name"
          $error={touched.first_name && errors.first_name}
          disabled={loading}
        />
        {touched.first_name && errors.first_name && (
          <ErrorText>{errors.first_name}</ErrorText>
        )}
      </FormGroup>

      <FormGroup>
        <Label>
          <span>*</span> Last Name
        </Label>
        <Input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Please enter last name"
          $error={touched.last_name && errors.last_name}
          disabled={loading}
        />
        {touched.last_name && errors.last_name && (
          <ErrorText>{errors.last_name}</ErrorText>
        )}
      </FormGroup>

      <FormGroup>
        <Label>
          <span>*</span> Email
        </Label>
        <Input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Please enter email"
          $error={touched.email && errors.email}
          disabled={loading}
        />
        {touched.email && errors.email && (
          <ErrorText>{errors.email}</ErrorText>
        )}
      </FormGroup>

      <FormGroup>
        <Label>
          <span>*</span> Profile Image Link
        </Label>
        <Input
          type="text"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Please enter profile image link"
          $error={touched.avatar && errors.avatar}
          disabled={loading}
        />
        {touched.avatar && errors.avatar && (
          <ErrorText>{errors.avatar}</ErrorText>
        )}
      </FormGroup>

      <ButtonGroup>
        <CancelButton type="button" onClick={onClose} disabled={loading}>
          Cancel
        </CancelButton>
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </SubmitButton>
      </ButtonGroup>
    </Form>
  );
};

export default UserForm;
