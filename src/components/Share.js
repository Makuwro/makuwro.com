import React from "react";
import styles from "../styles/Settings.module.css";
import PermissionDropdown from "./PermissionDropdown";

export default function ShareManager() {

  return (
    <section id={styles["settings-prompt"]}>
      <section>
        <h1>Share and credit</h1>
        <form>
          <input type="text" placeholder="Enter a name"></input>
        </form>
        <ul style={{width: "500px", padding: 0, marginTop: "1.5rem", textAlign: "left", overflowY: "auto", maxHeight: "273px"}}>
          <li style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <section style={{display: "flex", alignItems: "center"}}>
              <img style={{borderRadius: "100%"}} width={50} src="https://images-ext-2.discordapp.net/external/Y39UbC_wLpp7RB-X0tPvubvlbNjlO50CUv4QgqSbUos/%3Fsize%3D256/https/cdn.discordapp.com/avatars/419881371004174338/eb4ee7cebaf7c0862fbed37903ff9668.png" />
              <section style={{marginLeft: "1rem", textAlign: "left"}}>
                <section style={{color: "white"}}>Christian "Sudobeast" Toney</section>
                <section style={{textAlign: "left"}}>World & Plot Writer</section>
              </section>
            </section>
            <PermissionDropdown />
          </li>
          <li style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem"}}>
            <section style={{display: "flex", alignItems: "center"}}>
              <img style={{borderRadius: "100%"}} width={50} src="https://images-ext-2.discordapp.net/external/_sjYwkwJnYjYi359MUUAVyvX32_Ha-2tfmwbW92Tw1g/%3Fsize%3D256/https/cdn.discordapp.com/avatars/258388177306255360/3c04773081151bfd5edd06962d00bd17.png" />
              <section style={{marginLeft: "1rem", textAlign: "left"}}>
                <section style={{color: "white"}}>Dylan "Quintt" Provenzano</section>
                <section style={{textAlign: "left"}}>Game Designer</section>
              </section>
            </section>
            <PermissionDropdown />
          </li>
          <li style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid"}}>
            <section style={{display: "flex", alignItems: "center"}}>
              <img style={{borderRadius: "100%"}} width={50} src="https://images-ext-2.discordapp.net/external/_sjYwkwJnYjYi359MUUAVyvX32_Ha-2tfmwbW92Tw1g/%3Fsize%3D256/https/cdn.discordapp.com/avatars/258388177306255360/3c04773081151bfd5edd06962d00bd17.png" />
              <section style={{marginLeft: "1rem", textAlign: "left"}}>
                <section style={{color: "white"}}>Other members</section>
              </section>
            </section>
            <PermissionDropdown />
          </li>
          <li style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem"}}>
            <section style={{display: "flex", alignItems: "center"}}>
              <img style={{borderRadius: "100%"}} width={50} src="https://images-ext-2.discordapp.net/external/_sjYwkwJnYjYi359MUUAVyvX32_Ha-2tfmwbW92Tw1g/%3Fsize%3D256/https/cdn.discordapp.com/avatars/258388177306255360/3c04773081151bfd5edd06962d00bd17.png" />
              <section style={{marginLeft: "1rem", textAlign: "left"}}>
                <section style={{color: "white"}}>Everyone else</section>
              </section>
            </section>
            <PermissionDropdown />
          </li>
        </ul>
      </section>
    </section>
  );

}