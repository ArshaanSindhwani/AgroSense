import { registerUser, loginUser, logoutUser } from "../../services/firebase/auth";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockSet = jest.fn();
const mockDoc = jest.fn(() => ({ set: mockSet }));
const mockCollection = jest.fn(() => ({ doc: mockDoc }));

const mockCreateUser = jest.fn();
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();

jest.mock("@react-native-firebase/auth", () => () => ({
  createUserWithEmailAndPassword: mockCreateUser,
  signInWithEmailAndPassword: mockSignIn,
  signOut: mockSignOut,
}));

jest.mock("@react-native-firebase/firestore", () => {
  const firestoreFn = () => ({ collection: mockCollection });
  firestoreFn.FieldValue = { serverTimestamp: jest.fn(() => "TIMESTAMP") };
  return firestoreFn;
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeUser = (uid = "uid-123") => ({ user: { uid } });

const makeAuthError = (code) => Object.assign(new Error(code), { code });

// ─── registerUser ─────────────────────────────────────────────────────────────

describe("registerUser", () => {
  beforeEach(() => jest.clearAllMocks());

  it("creates user and writes to firestore, returns success message", async () => {
    mockCreateUser.mockResolvedValueOnce(makeUser("uid-abc"));
    mockSet.mockResolvedValueOnce();

    const result = await registerUser("  Test@Email.com  ", "password123");

    expect(mockCreateUser).toHaveBeenCalledWith("Test@Email.com", "password123");
    expect(mockCollection).toHaveBeenCalledWith("users");
    expect(mockDoc).toHaveBeenCalledWith("uid-abc");
    expect(mockSet).toHaveBeenCalledWith({
      userId: "uid-abc",
      email: "test@email.com",
      role: "farmer",
      createdAt: "TIMESTAMP",
      updatedAt: "TIMESTAMP",
    });
    expect(result).toBe("User successfully created!");
  });

  it("trims and lowercases email before writing to firestore", async () => {
    mockCreateUser.mockResolvedValueOnce(makeUser());
    mockSet.mockResolvedValueOnce();

    await registerUser("  FARMER@EXAMPLE.COM  ", "pass1234");

    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({ email: "farmer@example.com" })
    );
  });

  it("throws if email already in use", async () => {
    mockCreateUser.mockRejectedValueOnce(makeAuthError("auth/email-already-in-use"));

    await expect(registerUser("a@b.com", "pass")).rejects.toThrow(
      "That email address is already in use."
    );
  });

  it("throws if email is invalid", async () => {
    mockCreateUser.mockRejectedValueOnce(makeAuthError("auth/invalid-email"));

    await expect(registerUser("bademail", "pass")).rejects.toThrow(
      "That email address is invalid."
    );
  });

  it("throws if password is too weak", async () => {
    mockCreateUser.mockRejectedValueOnce(makeAuthError("auth/weak-password"));

    await expect(registerUser("a@b.com", "123")).rejects.toThrow(
      "Password must be at least 6 characters."
    );
  });

  it("throws generic message for unknown errors", async () => {
    mockCreateUser.mockRejectedValueOnce(makeAuthError("auth/network-request-failed"));

    await expect(registerUser("a@b.com", "pass123")).rejects.toThrow(
      "Something went wrong. Please try again."
    );
  });
});

// ─── loginUser ────────────────────────────────────────────────────────────────

describe("loginUser", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls signInWithEmailAndPassword with trimmed email", async () => {
    mockSignIn.mockResolvedValueOnce();

    await loginUser("  user@example.com  ", "password123");

    expect(mockSignIn).toHaveBeenCalledWith("user@example.com", "password123");
  });

  it("throws if user not found", async () => {
    mockSignIn.mockRejectedValueOnce(makeAuthError("auth/user-not-found"));

    await expect(loginUser("a@b.com", "pass")).rejects.toThrow(
      "No account found with that email."
    );
  });

  it("throws if password is wrong", async () => {
    mockSignIn.mockRejectedValueOnce(makeAuthError("auth/wrong-password"));

    await expect(loginUser("a@b.com", "wrongpass")).rejects.toThrow(
      "Incorrect password."
    );
  });

  it("throws if email is invalid", async () => {
    mockSignIn.mockRejectedValueOnce(makeAuthError("auth/invalid-email"));

    await expect(loginUser("bademail", "pass")).rejects.toThrow(
      "That email address is invalid."
    );
  });

  it("throws if too many attempts", async () => {
    mockSignIn.mockRejectedValueOnce(makeAuthError("auth/too-many-requests"));

    await expect(loginUser("a@b.com", "pass")).rejects.toThrow(
      "Too many attempts. Please try again later."
    );
  });

  it("throws generic message for unknown errors", async () => {
    mockSignIn.mockRejectedValueOnce(makeAuthError("auth/internal-error"));

    await expect(loginUser("a@b.com", "pass")).rejects.toThrow(
      "Something went wrong. Please try again."
    );
  });
});

// ─── logoutUser ───────────────────────────────────────────────────────────────

describe("logoutUser", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls signOut successfully", async () => {
    mockSignOut.mockResolvedValueOnce();

    await logoutUser();

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it("throws if signOut fails", async () => {
    mockSignOut.mockRejectedValueOnce(new Error("network error"));

    await expect(logoutUser()).rejects.toThrow(
      "Failed to log out. Please try again."
    );
  });
});