import { APIRequestContext, Page } from "@playwright/test";
import _ from "lodash";
import { Community } from "../../../helper/interface/careOptions";
import { connectToMongo } from "../../../helper/db/mongo";
export class CareOptions {
  mySearchUrl = process.env.BASE_URL_MY_SEARCH;
  private readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async findCareOptions(
    request: APIRequestContext,
    token: string
  ): Promise<any> {
    return request.get(`${this.mySearchUrl}/care-options`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  verifySlug(
    communities: Community[]
  ): { id: string; name: string; expected: string; actual: string }[] {
    const issues: {
      id: string;
      name: string;
      expected: string;
      actual: string;
    }[] = []; // To collect mismatched slugs

    communities.forEach((community) => {
      const expectedSlug = `${_.kebabCase(community.name.replace(/&/g, ""))}-${community.id}`;
      console.log(expectedSlug);
      if (community.slug !== expectedSlug) {
        issues.push({
          id: community.id,
          name: community.name,
          expected: expectedSlug,
          actual: community.slug,
        });
      }
    });
    if (issues.length === 0) {
      console.log("All slugs are correct");
    } else {
      console.error("Slug mismatches found: ", issues);
    }
    return issues;
  }
  async findThumbnail(community: number) {
    const communityData = await connectToMongo(
      `${process.env.MONGO_ENV}`,
      "communities",
      { id: community }
    );
    // Check if images exist
    if (communityData.images?.length > 0) {
      for (const image of communityData.images) {
        if (image.assets) {
          for (const asset of image.assets) {
            // Verify the conditions
            if (asset.isLogo === false && asset.sizeId === 4) {
              return asset.yglId; // Return yglId if conditions are met
            }
          }
        }
      }
    } else {
      if (communityData.defaultImages.length > 0) {
        return communityData.defaultImages[0].id;
      }
    }
    return null;
  }
}
