"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "table" | "prompt" | "icon" | "launcher" | "logout" | "sidebar";

type SharedButtonProps = {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  variant?: ButtonVariant;
};

type NativeButtonProps = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkButtonProps = SharedButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    type?: never;
    disabled?: never;
  };

type ButtonProps = NativeButtonProps | LinkButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "button primary",
  secondary: "button button-secondary",
  table: "table-action",
  prompt: "button button-prompt",
  icon: "button assistant-icon-button",
  launcher: "button assistant-launcher",
  logout: "button sidebar-logout",
  sidebar: "button sidebar-toggle",
};

function classes(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function isLinkButton(props: ButtonProps): props is LinkButtonProps {
  return typeof props.href === "string";
}

export function Button(props: ButtonProps) {
  const { children, className, fullWidth = false, variant = "secondary" } = props;
  const buttonClassName = classes(variantClasses[variant], fullWidth && "button-full", className);

  if (isLinkButton(props)) {
    const { href, children: _children, className: _className, fullWidth: _fullWidth, variant: _variant, ...linkProps } = props;

    return (
      <Link className={buttonClassName} href={href} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonOnlyProps = props as NativeButtonProps;
  const {
    children: _children,
    className: _className,
    fullWidth: _fullWidth,
    variant: _variant,
    ...buttonProps
  } = buttonOnlyProps;

  return (
    <button className={buttonClassName} {...buttonProps}>
      {children}
    </button>
  );
}
