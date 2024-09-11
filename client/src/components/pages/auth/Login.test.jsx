import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Login from '../../../components/pages/auth/Login';  
import { login as loginAPI, currentUser } from '../../../function/auth'; 
import { login as loginRedux } from '../../../store/userSlice';
import { createMockStore } from '../../../test-utils';

vi.mock('../../../function/auth', () => ({
  login: vi.fn(),
  currentUser: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'),
    useNavigate: vi.fn(),
    MemoryRouter: ({ children }) => <div>{children}</div>,
  }));

describe('Login', () => {
  let store;
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    const initialState = {
      user: {
        value: '1234',
        user: [],  
      },
    };
    store = createMockStore(initialState);
    store.dispatch = mockDispatch;  
    vi.clearAllMocks();  
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('save token to localStorage on successful login', async () => {
    const mockToken = 'mock.jwt.token';
    const mockUserData = {
      citizenID: '12345',
      prefix: 'm',
      name: 'a',
      surname: 'b',
      role: 'user',
      email: 'e@example.com',
      phone: '1234567890',
      divisionName: 'Division',
      sub_division: 'Subdivision',
      position: 'Developer',
      password: '1234',
      birthday: '1990-01-01',
      type_of_employee: 'Full-time',
      start_of_work_on: '2020-01-01',
      position_first_supeior: 'Manager',
      position_second_supeior: 'Director',
      accessToken: mockToken,
    };

    loginAPI.mockResolvedValueOnce({ data: mockUserData });  

    currentUser.mockResolvedValueOnce({ data: { role: 'user' } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('CitizenID'), { target: { value: '12345' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: "เข้าสู่ระบบ" }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        loginRedux({
          citizenID: mockUserData.citizenID,
          prefix: mockUserData.prefix,
          name: mockUserData.name,
          surname: mockUserData.surname,
          role: mockUserData.role,
          email: mockUserData.email,
          phone: mockUserData.phone,
          divisionName: mockUserData.divisionName,
          sub_division: mockUserData.sub_division,
          position: mockUserData.position,
          password: mockUserData.password,
          birthday: mockUserData.birthday,
          type_of_employee: mockUserData.type_of_employee,
          start_of_work_on: mockUserData.start_of_work_on,
          position_first_supeior: mockUserData.position_first_supeior,
          position_second_supeior: mockUserData.position_second_supeior,
          token: mockToken,
        })
      );

      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(mockNavigate).toHaveBeenCalledWith('/')
    });
  });
});
