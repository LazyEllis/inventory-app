export const getSelectedRoleData = () => {
  const roleSections = [
    ...document.querySelectorAll("#author-roles .form-group"),
  ];

  return roleSections.map((section) => {
    const dropdown = section.querySelector("select");

    return {
      id: dropdown.getAttribute("id"),
      name: dropdown.getAttribute("name"),
      value: dropdown.value,
    };
  });
};

export const removeAllRoleSections = () => {
  const roleSections = [
    ...document.querySelectorAll("#author-roles .form-group"),
  ];
  roleSections.forEach((section) => section.remove());
};

export const createRoleGroup = (name, id, role) => {
  const template = document.querySelector("template");

  const roleGroup = template.content.cloneNode(true);
  const label = roleGroup.querySelector("label");
  const select = roleGroup.querySelector("select");

  label.textContent = `${name}'s Role`;
  label.setAttribute("for", role?.id || `author-${id}-role`);
  select.setAttribute("name", role?.name || `authors[${id}][role]`);
  select.setAttribute("id", role?.id || `author-${id}-role`);

  if (role) {
    select.value = role.value;
  }

  return roleGroup;
};
