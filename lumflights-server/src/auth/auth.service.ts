import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'staff1', password: 'staff123', role: 'staff' },
    { username: 'staff2', password: 'staff123', role: 'staff' },
    { username: 'staff3', password: 'staff123', role: 'staff' },
    { username: 'staff4', password: 'staff123', role: 'staff' },
    { username: 'staff5', password: 'staff123', role: 'staff' },
    { username: 'staff6', password: 'staff123', role: 'staff' },
    { username: 'staff7', password: 'staff123', role: 'staff' },
    { username: 'staff8', password: 'staff123', role: 'staff' },
    { username: 'staff9', password: 'staff123', role: 'staff' },
    { username: 'staff10', password: 'staff123', role: 'staff' },
  ];

  validateUser(username: string, password: string) {
    return this.users.find(
      (user) => user.username === username && user.password === password,
    );
  }
}
