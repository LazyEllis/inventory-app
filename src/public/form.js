import {
  getSelectedRoleData,
  removeAllRoleSections,
  createRoleGroup,
} from "./form-utils.js";

const authorRolesFieldset = document.querySelector("#author-roles");
const authorCheckboxes = document.querySelectorAll(".author");

const createRoleSection = (name, id, role) => {
  const newRoleGroup = createRoleGroup(name, id, role);
  authorRolesFieldset.appendChild(newRoleGroup);
};

const renderRoleSections = () => {
  const authorRoles = getSelectedRoleData();
  removeAllRoleSections();

  authorCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const authorId = checkbox.value;
      const authorName = checkbox.nextElementSibling.textContent;
      const authorRole = authorRoles.find(
        (role) => `author-${authorId}-role` === role.id,
      );

      createRoleSection(authorName, authorId, authorRole);
    }
  });
};

authorCheckboxes.forEach((checkbox) =>
  checkbox.addEventListener("change", renderRoleSections),
);

if (!authorRolesFieldset.querySelector(".form-group")) {
  renderRoleSections();
}
