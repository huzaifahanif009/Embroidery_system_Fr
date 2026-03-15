import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";

@Component({
  selector: "erp-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-split-card">
        <div class="brand-side">
          <div class="brand-top">
            <div class="logo-box">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
              </svg>
            </div>
            <span class="brand-name">Threadwork</span>
          </div>

          <div class="brand-main">
            <h1>
              Precision in <br /><span class="accent-text">every stitch.</span>
            </h1>
            <p>
              The premium management suite for embroidery studios and textile
              manufacturing.
            </p>
          </div>

          <div class="brand-footer">
            <div class="status-indicator">
              <span class="pulse-dot"></span>
              System Operational
            </div>
          </div>
        </div>

        <div class="form-side">
          <div class="form-wrapper">
            <div class="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to manage your production floor</p>
            </div>

            <div *ngIf="errorMsg" class="error-toast">
              <i class="pi pi-exclamation-triangle"></i> {{ errorMsg }}
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="erp-form">
              <div class="form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="manager@studio.com"
                />
              </div>

              <div class="form-field">
                <div class="label-split">
                  <label>Password</label>
                  <a href="#" class="forgot-pass">Reset Password</a>
                </div>
                <div class="pass-input-group">
                  <input
                    [type]="showPwd ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    class="toggle-visibility"
                    (click)="showPwd = !showPwd"
                  >
                    <i
                      class="pi"
                      [ngClass]="showPwd ? 'pi-eye-slash' : 'pi-eye'"
                    ></i>
                  </button>
                </div>
              </div>

              <div class="form-field">
                <label>Workspace URL</label>
                <div class="slug-group">
                  <input
                    type="text"
                    formControlName="tenant"
                    placeholder="my-studio"
                  />
                  <span class="slug-hint">.threadwork.io</span>
                </div>
              </div>

              <button type="submit" class="submit-btn" [disabled]="loading">
                <ng-container *ngIf="!loading">
                  <span>Sign in</span>
                  <i class="pi pi-sign-in"></i>
                </ng-container>
                <i *ngIf="loading" class="pi pi-spin pi-spinner"></i>
              </button>
            </form>

            <p class="help-text">
              New to Threadwork? <a href="#">Request an invite</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Deep Green & Cream Palette */
      :host {
        --dark-green: #1a2e26;
        --forest-green: #2d4a3e;
        --cream-bg: #fdfcf8;
        --cream-card: #f7f5ed;
        --text-main: #2c3330;
        --text-muted: #6b7280;
        --accent-gold: #c5a059;
      }

      .login-container {
        height: 100vh;
        width: 100vw;
        background-color: #f3f2ec;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Inter", system-ui, sans-serif;
        padding: 20px;
      }

      .login-split-card {
        display: flex;
        width: 100%;
        max-width: 1000px;
        min-height: 650px;
        background: var(--cream-bg);
        border-radius: 32px;
        overflow: hidden;
        box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.15);
      }

      /* Left: Brand (Dark Green) */
      .brand-side {
        flex: 1;
        background: var(--dark-green);
        padding: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: var(--cream-bg);
        position: relative;
      }
      .logo-box {
        width: 44px;
        height: 44px;
        background: var(--forest-green);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
      }
      .brand-top {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      .brand-name {
        font-weight: 700;
        font-size: 20px;
        letter-spacing: -0.5px;
      }

      .brand-main h1 {
        font-size: 48px;
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 24px;
      }
      .accent-text {
        color: var(--accent-gold);
      }
      .brand-main p {
        font-size: 18px;
        opacity: 0.8;
        line-height: 1.6;
        max-width: 320px;
      }

      .status-indicator {
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        opacity: 0.6;
      }
      .pulse-dot {
        width: 8px;
        height: 8px;
        background: #4ade80;
        border-radius: 50%;
        box-shadow: 0 0 10px #4ade80;
      }

      /* Right: Form (Creamy White) */
      .form-side {
        flex: 1.1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;
      }
      .form-wrapper {
        width: 100%;
        max-width: 360px;
      }
      .form-header h2 {
        font-size: 32px;
        font-weight: 800;
        color: var(--text-main);
        margin-bottom: 8px;
      }
      .form-header p {
        color: var(--text-muted);
        font-size: 15px;
        margin-bottom: 32px;
      }

      .form-field {
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .form-field label {
        font-size: 13px;
        font-weight: 700;
        color: var(--text-main);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .label-split {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .forgot-pass {
        font-size: 12px;
        color: var(--forest-green);
        font-weight: 600;
        text-decoration: none;
      }

      input {
        padding: 14px 16px;
        border-radius: 12px;
        border: 1.5px solid #e5e7eb;
        background: white;
        font-size: 15px;
        transition: all 0.2s;
      }
      input:focus {
        outline: none;
        border-color: var(--forest-green);
        box-shadow: 0 0 0 4px rgba(45, 74, 62, 0.1);
      }

      .pass-input-group,
      .slug-group {
        position: relative;
        display: flex;
        align-items: center;
      }
      .pass-input-group input,
      .slug-group input {
        width: 100%;
      }
      .toggle-visibility {
        position: absolute;
        right: 14px;
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
      }
      .slug-hint {
        position: absolute;
        right: 16px;
        font-size: 13px;
        color: var(--text-muted);
        font-weight: 500;
      }

      .submit-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px; /* Space between 'Sign in' and the icon */
        width: 100%;
        padding: 16px;
        background: var(--dark-green);
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 700;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .submit-btn i {
        font-size: 1.1rem;
        transition: transform 0.2s ease;
      }

      .submit-btn:hover:not(:disabled) {
        background: var(--forest-green);
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(26, 46, 38, 0.2);
      }

      .submit-btn:hover:not(:disabled) i {
        transform: translateX(3px); /* Subtle nudge to the right on hover */
      }

      .submit-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .error-toast {
        background: #fff1f2;
        border-left: 4px solid #e11d48;
        color: #9f1239;
        padding: 12px;
        border-radius: 8px;
        font-size: 14px;
        margin-bottom: 24px;
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .help-text {
        margin-top: 32px;
        text-align: center;
        font-size: 14px;
        color: var(--text-muted);
      }
      .help-text a {
        color: var(--forest-green);
        font-weight: 700;
        text-decoration: none;
      }

      @media (max-width: 850px) {
        .brand-side {
          display: none;
        }
        .login-split-card {
          max-width: 450px;
        }
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  // Logic remains consistent with your previous setup
  form!: FormGroup;
  loading = false;
  errorMsg = "";
  showPwd = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) this.router.navigate(["/dashboard"]);
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [Validators.required],
      ],
      tenant: ["", Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMsg = "";
    const { email, password, tenant } = this.form.value;
    this.auth.login(email, password, tenant).subscribe({
      next: () => {
        this.toast.success("Welcome back!");
        this.router.navigate(["/dashboard"]);
      },
      error: (e: Error) => {
        this.loading = false;
        this.errorMsg = e.message || "Invalid credentials";
      },
    });
  }
}
