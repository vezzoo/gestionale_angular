import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiUrls } from 'src/app/base/enums/enums';
import { User } from 'src/app/base/models/user.model';
import { TranslateErrorPipe } from 'src/app/base/pipes/translateError.pipe';
import { HttpClientService } from 'src/app/base/services/httpClient.service';
import { CommonUtils } from 'src/app/base/utils/common.utils';
import { ApiError } from 'src/types/api-error';
import {
  UsersGetResponse,
  UsersPatchRequest,
  UsersPatchResponse,
  UsersPutRequest,
  UsersPutResponse,
} from 'src/types/users';

interface Permission {
  name: string;
  value: boolean;
}

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss'],
})
export class UsersManagementComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  users: User[] = [];
  permissions: Permission[] = [];
  newPasswordHide: boolean = true;
  confirmPassword: boolean = true;
  addingUser: boolean = false;

  private oldPermissions: Permission[] = [];
  private me: User;
  private selected: User;

  constructor(
    private httpClientService: HttpClientService,
    private translateErrorPipe: TranslateErrorPipe,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.httpClientService.get<string[]>(
      ApiUrls.PERMISSIONS,
      (response: string[]) => {
        this.permissions = response.map((e) => {
          return {
            name: e,
            value: false,
          };
        });
      },
      (error: ApiError) => {}
    );

    this.httpClientService.get<UsersGetResponse>(
      ApiUrls.USERS,
      (response: UsersGetResponse) => {
        this.me = response?.me;

        if (response?.user_list) {
          this.users = response.user_list
            .sort((a, b) => {
              if (a.username < b.username) return -1;
              if (a.username > b.username) return 1;
              return 0;
            })
            .sort((a, b) => {
              if (a.permissions?.length < b.permissions?.length) return 1;
              if (a.permissions?.length > b.permissions?.length) return -1;

              return 0;
            })
            .sort((a, b) => {
              if (a.id === this.me.id) return -1;
              if (b.id === this.me.id) return 1;
            })
            .filter((u) => u.username !== 'root');
        } else if (this.me) {
          this.users = [this.me];
        }

        this.onUserSelected(this.me);
      },
      (error: ApiError) => {}
    );
  }

  isValid(): boolean {
    if (!this.addingUser) {
      if (CommonUtils.getFormControlValue(this.form, 'newPassword')) {
        return (
          CommonUtils.getFormControlValue(this.form, 'newPassword') ===
          CommonUtils.getFormControlValue(this.form, 'confirmPassword')
        );
      } else {
        return this.arePermissionsChanged();
      }
    } else {
      const isUsrOk = !!CommonUtils.getFormControlValue(this.form, 'username');
      let isPwdOk: boolean = false;

      if (CommonUtils.getFormControlValue(this.form, 'newPassword')) {
        isPwdOk =
          CommonUtils.getFormControlValue(this.form, 'newPassword') ===
          CommonUtils.getFormControlValue(this.form, 'confirmPassword');
      }

      return isUsrOk && isPwdOk && this.arePermissionsChanged();
    }
  }

  onSave() {
    if (!this.addingUser) {
      this.updateUser(this.selected?.id);
    } else {
      const body: UsersPutRequest = {
        username: CommonUtils.getFormControlValue(this.form, 'username'),
        permissions: this.permissions.filter((p) => p.value).map((p) => p.name),
      };
      this.oldPermissions = JSON.parse(JSON.stringify(this.permissions));

      this.httpClientService.put<UsersPutResponse>(
        ApiUrls.USERS,
        body,
        (response: UsersPutResponse) => {
          if (response?.id) {
            this.updateUser(response?.id);
          }
        },
        (error: ApiError) =>
          {}
      );
    }
  }

  onDelete(event: any) {
    if (!event.ctrlKey) {
      console.log('CTRL + click expected');
    } else {
      this.httpClientService.delete<Object>(
        `${ApiUrls.USERS}${this.selected?.id}`,
        (response: Object) => {
          if (response) this.modal.close();
        },
        (error: ApiError) =>
          {}
      );
    }
  }

  onAdd() {
    this.addingUser = true;
    this.permissions = this.permissions.map((e) => {
      e.value = false;
      return e;
    });
    this.oldPermissions = JSON.parse(JSON.stringify(this.permissions));
  }

  isPermissionGranted(permission: string): boolean {
    if (this.addingUser) return false;
    else return this.selected?.permissions?.includes(permission);
  }

  hasPermissions() {
    return this.users?.length > 1;
  }

  getUserIcon(id: string): string {
    if (this.isCurrentUser(id)) return 'star';
    else return 'account_circle';
  }

  isCurrentUser(id: string): boolean {
    return id === this.me.id;
  }

  isUserSelected(id: string): boolean {
    return id === this.selected?.id && !this.addingUser;
  }

  onUserSelected(user: User) {
    if (this.users.find((u) => u.id === user.id)) {
      this.selected = user;
    } else {
      this.selected = this.users[0];
    }
    this.addingUser = false;
    this.permissions = this.permissions.map((e) => {
      e.value = this.selected.permissions.includes(e.name);
      return e;
    });

    this.oldPermissions = JSON.parse(JSON.stringify(this.permissions));
  }

  private updateUser(id: string) {
    let body: UsersPatchRequest = {
      id: id,
    };

    const newPassword = CommonUtils.getFormControlValue(this.form, 'newPassword');
    const confirmPassword = CommonUtils.getFormControlValue(this.form, 'confirmPassword');

    if (newPassword && newPassword === confirmPassword) {
      body.password = newPassword;
    }

    if (this.arePermissionsChanged()) {
      body.permissions = this.permissions
        .filter((p) => p.value)
        .map((p) => p.name);
    }

    this.httpClientService.patch<UsersPatchResponse>(
      ApiUrls.USERS,
      body,
      (response: UsersPatchResponse) => {
        if (response?.status) this.modal.close();
      },
      (error: ApiError) => {}
    );
  }

  private arePermissionsChanged() {
    return (
      JSON.stringify(this.permissions) !== JSON.stringify(this.oldPermissions)
    );
  }
}
