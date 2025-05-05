import { useState, ChangeEvent, FormEvent } from 'react';
import { adminApi } from '../../../services/api';
import { ICreateHomeworkRequest } from '../../../types';

export const useHomeworkController = () => {
  const [formData, setFormData] = useState<ICreateHomeworkRequest>({
    title: '',
    description: '',
    dueDate: '',
    classId: '',
    subject: '',
    attachments: [],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, attachments: files.map((file) => file.name) }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.homework.create(formData);
      // Reset form
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        classId: '',
        subject: '',
        attachments: [],
      });
      // TODO: Add success message
    } catch {
      // TODO: Add error handling
    }
  };

  return {
    formData,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
}; 