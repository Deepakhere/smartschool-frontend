import { useState, ChangeEvent, FormEvent } from 'react';
import { adminApi } from '../../../services/api';
import { ICreateFeeRequest } from '../../../types';

export const useFeesController = () => {
  const [formData, setFormData] = useState<ICreateFeeRequest>({
    studentId: '',
    amount: 0,
    dueDate: '',
    description: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.fees.create(formData);
      // Reset form
      setFormData({
        studentId: '',
        amount: 0,
        dueDate: '',
        description: '',
      });
      // TODO: Add success message
    } catch {
      // TODO: Add error handling
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
}; 