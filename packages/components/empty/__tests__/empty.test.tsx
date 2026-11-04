/* eslint-disable */
import { render } from "@test/utils";
import React from "react";

import Empty from "../index";

describe("Empty", () => {
  describe("props", () => {
    test("size[small]", async () => {
      const { container } = render(<Empty size="small" />);
      expect(container.querySelector(".t-empty.t-size-s")).not.toBeNull();
    });

    test("title[string]", async () => {
      const { container } = render(<Empty title="title" />);
      expect(container.querySelector(".t-empty__title").innerHTML).toBe(
        "title",
      );
    });

    test("description[string]", async () => {
      const { container } = render(<Empty description="description" />);
      expect(container.querySelector(".t-empty__description").innerHTML).toBe(
        "description",
      );
    });

    test("type[success]", async () => {
      const { container } = render(<Empty type="success" />);
      expect(
        container.querySelector(".t-empty__image .t-icon-check-circle-filled"),
      ).not.toBeNull();
    });

    test("action[TNode]", async () => {
      const { container } = render(<Empty action={<div>action</div>} />);
      expect(container.querySelector(".t-empty__action").innerHTML).toBe(
        "<div>action</div>",
      );
    });

    test("image[TNode]", async () => {
      const { container } = render(<Empty image={<div>image</div>} />);
      expect(container.querySelector(".t-empty__image").innerHTML).toBe(
        "<div>image</div>",
      );
    });
  });
});
