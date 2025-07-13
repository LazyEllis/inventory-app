const roleFormGroup = document.querySelector(".form-group.role");

export const getSelectedRoleData = () => {
  const roleSections = [...document.querySelectorAll(".form-group.role")];

  return roleSections.map((section) => ({
    id: section.querySelector("select").getAttribute("id"),
    value: section.querySelector("select").value,
  }));
};

export const removeAllRoleSections = () => {
  const roleSections = [...document.querySelectorAll(".form-group.role")];
  roleSections.forEach((section) => section.remove());
};

export const createRoleGroup = (name, id, role) => {
  const roleGroup = roleFormGroup.cloneNode(true);
  const label = roleGroup.querySelector("label");
  const select = roleGroup.querySelector("select");

  label.textContent = `${name}'s Role`;
  label.setAttribute("for", role?.id || `author-${id}-role`);
  select.setAttribute("id", role?.id || `author-${id}-role`);

  if (role) {
    select.value = role.value;
  }

  return roleGroup;
};
