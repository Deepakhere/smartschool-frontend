import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { TenantProvider, useTenant } from "./tenant-context";

let mockOrgId = "org-1";
vi.mock("react-router-dom", () => ({
  useParams: () => ({ organizationId: mockOrgId }),
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>,
}));

let mockUser: { isPlatformAdmin?: boolean } | null = { isPlatformAdmin: false };
vi.mock("./auth-context", () => ({
  useAuth: () => ({ user: mockUser }),
}));

let mockIsLoading = false;
let mockOrganizations: { id: string; name: string }[] = [{ id: "org-1", name: "School One" }];
vi.mock("../pages/auth/service/get-all-organization/get-all-organization", () => ({
  default: () => ({ isLoading: mockIsLoading, data: { items: mockOrganizations } }),
}));

const Consumer = () => {
  const { organizationId, organization } = useTenant();
  return (
    <div data-testid="consumer">
      {organizationId} / {organization?.name}
    </div>
  );
};

describe("TenantProvider", () => {
  it("shows a loading state while memberships are still resolving", () => {
    mockIsLoading = true;
    render(
      <TenantProvider>
        <Consumer />
      </TenantProvider>
    );
    expect(screen.queryByTestId("consumer")).not.toBeInTheDocument();
    mockIsLoading = false;
  });

  it("renders children when the route's organizationId matches a real membership", () => {
    mockOrgId = "org-1";
    mockOrganizations = [{ id: "org-1", name: "School One" }];
    render(
      <TenantProvider>
        <Consumer />
      </TenantProvider>
    );
    expect(screen.getByTestId("consumer")).toHaveTextContent("org-1 / School One");
  });

  it("redirects to /not-access when the organizationId isn't one of the user's memberships", () => {
    mockOrgId = "someone-elses-school";
    mockOrganizations = [{ id: "org-1", name: "School One" }];
    mockUser = { isPlatformAdmin: false };
    render(
      <TenantProvider>
        <Consumer />
      </TenantProvider>
    );
    expect(screen.getByTestId("navigate")).toHaveTextContent("/not-access");
    expect(screen.queryByTestId("consumer")).not.toBeInTheDocument();
  });

  it("lets a platform admin through even without a membership in that org", () => {
    mockOrgId = "someone-elses-school";
    mockOrganizations = [{ id: "org-1", name: "School One" }];
    mockUser = { isPlatformAdmin: true };
    render(
      <TenantProvider>
        <Consumer />
      </TenantProvider>
    );
    expect(screen.getByTestId("consumer")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });
});
