import React from "react";
import FormatterButton from "../FormatterButton";
import PropTypes from "prop-types";

export default function FormatterEditParagraphComponent({alignSelection, contentContainerSelected}) {

  return (
    <>
      <section>
        <FormatterButton disabled={!contentContainerSelected} iconName="format_align_left" onClick={() => alignSelection()} type="button" title="Align paragraph to the left" />
        <FormatterButton disabled={!contentContainerSelected} iconName="format_align_center" onClick={() => alignSelection("center")} type="button" title="Align paragraph to the center" />
        <FormatterButton disabled={!contentContainerSelected} iconName="format_align_right" onClick={() => alignSelection("right")} type="button" title="Align paragraph to the right" />
        <FormatterButton disabled={!contentContainerSelected} iconName="format_align_justify" onClick={() => alignSelection("justify")} type="button" title="Justify paragraph" />
      </section>
      <section>
        <FormatterButton disabled={!contentContainerSelected} iconName="format_line_spacing" />
        <FormatterButton disabled={!contentContainerSelected} iconName="format_indent_increase" />
        <FormatterButton disabled={!contentContainerSelected} iconName="format_indent_decrease" />
      </section>
    </>
  );

}

FormatterEditParagraphComponent.propTypes = {
  alignSelection: PropTypes.func.isRequired
};