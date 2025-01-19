import { faker } from "@faker-js/faker";
import * as jwt from "jsonwebtoken";
import { mutation, variables } from "../../helper/queries/createFamilyFile";
import { APIRequest, Page, request } from "@playwright/test";

export class TokenTestHelper {
  private readonly page: Page;
  private email: string;
  private familyFileId: string;
  private token: string;

  constructor(page: Page) {
    this.page = page;
    this.email = "";
    this.familyFileId = process.env.FAMILY_FILE_ID!;
    this.token = "";
  }

  async initialize(): Promise<void> {
    try {
      this.email = this.generateCustomEmail();
      console.log(`[INFO] Generated Email: ${this.email}`);
      this.token = this.generateToken(this.email, `${process.env.FAMILY_FILE}`);
      process.env.MY_SEARCH_TOKEN = this.token;

      console.log(`[INFO] Generated Token: ${this.token}`);

      const isValid = this.verifyToken(this.token);
      if (!isValid) {
        throw new Error("Generated token is invalid.");
      }
    } catch (error) {
      console.error("[ERROR] Initialization failed:", error);
      throw error;
    }
  }

  private generateToken(email: string, familyFileId: string): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign({ email, familyFileId }, jwtSecret);
  }

  private verifyToken(token: string): boolean {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      console.log(`[INFO] Token is valid. Decoded payload:`, decoded);
      return true;
    } catch (error) {
      console.error(`[ERROR] Token verification failed:`, error.message);
      return false;
    }
  }

  private generateCustomEmail(): string {
    const firstName = faker.person.firstName().toLowerCase();
    const lastName = faker.person.lastName().toLowerCase();
    const randomNumbers = faker.number.int({ min: 100000, max: 999999 });
    const domain = "aplaceformom.com";

    return `${firstName}.${lastName}${randomNumbers}@${domain}`;
  }

  async createFamilyFile(request) {
    return request
      .post(`${process.env.BASE_URL_FAMILY_FILE}/graphql`)
      .set("Content-Type", "application/json")
      .send({ query: mutation, variables });
  }

  getEmail(): string {
    return this.email;
  }

  getFamilyFileId(): string {
    return this.familyFileId;
  }

  getToken(): string {
    return this.token;
  }
}
