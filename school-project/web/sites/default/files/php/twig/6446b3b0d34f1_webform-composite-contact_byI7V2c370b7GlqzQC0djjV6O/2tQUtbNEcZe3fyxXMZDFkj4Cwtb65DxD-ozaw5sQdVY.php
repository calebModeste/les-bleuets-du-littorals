<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* modules/contrib/webform/templates/webform-composite-contact.html.twig */
class __TwigTemplate_34ec0f01b59d7c8222d349fc1c01dbaa extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
        $this->sandbox = $this->env->getExtension('\Twig\Extension\SandboxExtension');
        $this->checkSecurity();
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 16
        if (($context["flexbox"] ?? null)) {
            // line 17
            echo "<div class=\"webform-contact\">
  ";
            // line 18
            if ((twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "name", [], "any", false, false, true, 18) || twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "company", [], "any", false, false, true, 18))) {
                // line 19
                echo "    <div class=\"webform-flexbox webform-contact__row-1\">
      ";
                // line 20
                if (twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "name", [], "any", false, false, true, 20)) {
                    // line 21
                    echo "        <div class=\"webform-flex webform-flex--1 webform-address__name\"><div class=\"webform-flex--container\">";
                    echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "name", [], "any", false, false, true, 21), 21, $this->source), "html", null, true);
                    echo "</div></div>
      ";
                }
                // line 23
                echo "      ";
                if (twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "company", [], "any", false, false, true, 23)) {
                    // line 24
                    echo "        <div class=\"webform-flex webform-flex--1 webform-address__company\"><div class=\"webform-flex--container\">";
                    echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "company", [], "any", false, false, true, 24), 24, $this->source), "html", null, true);
                    echo "</div></div>
      ";
                }
                // line 26
                echo "    </div>
  ";
            }
            // line 28
            echo "
  ";
            // line 29
            if ((twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "email", [], "any", false, false, true, 29) || twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "phone", [], "any", false, false, true, 29))) {
                // line 30
                echo "    <div class=\"webform-flexbox webform-contact__row-2\">
      ";
                // line 31
                if (twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "email", [], "any", false, false, true, 31)) {
                    // line 32
                    echo "        <div class=\"webform-flex webform-flex--1 webform-address__email\"><div class=\"webform-flex--container\">";
                    echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "email", [], "any", false, false, true, 32), 32, $this->source), "html", null, true);
                    echo "</div></div>
      ";
                }
                // line 34
                echo "      ";
                if (twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "phone", [], "any", false, false, true, 34)) {
                    // line 35
                    echo "        <div class=\"webform-flex webform-flex--1 webform-address__phone\"><div class=\"webform-flex--container\">";
                    echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "phone", [], "any", false, false, true, 35), 35, $this->source), "html", null, true);
                    echo "</div></div>
      ";
                }
                // line 37
                echo "    </div>
  ";
            }
            // line 39
            echo "
  ";
            // line 40
            if (twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "address", [], "any", false, false, true, 40)) {
                // line 41
                echo "    <div class=\"webform-flexbox webform-contact__row-3\">
      <div class=\"webform-flex webform-flex--1 webform-address__address\"><div class=\"webform-flex--container\">";
                // line 42
                echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "address", [], "any", false, false, true, 42), 42, $this->source), "html", null, true);
                echo "</div></div>
    </div>
  ";
            }
            // line 45
            echo "
  ";
            // line 46
            if (twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "address_2", [], "any", false, false, true, 46)) {
                // line 47
                echo "    <div class=\"webform-flexbox webform-contact__row-4\">
      <div class=\"webform-flex webform-flex--1 webform-address__address-2\"><div class=\"webform-flex--container\">";
                // line 48
                echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "address_2", [], "any", false, false, true, 48), 48, $this->source), "html", null, true);
                echo "</div></div>
    </div>
  ";
            }
            // line 51
            echo "
  ";
            // line 52
            if (((twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "city", [], "any", false, false, true, 52) || twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "state_province", [], "any", false, false, true, 52)) || twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "postal_code", [], "any", false, false, true, 52))) {
                // line 53
                echo "    <div class=\"webform-flexbox webform-contact__row-5\">
      ";
                // line 54
                if (twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "city", [], "any", false, false, true, 54)) {
                    // line 55
                    echo "        <div class=\"webform-flex webform-flex--1 webform-address__city\"><div class=\"webform-flex--container\">";
                    echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "city", [], "any", false, false, true, 55), 55, $this->source), "html", null, true);
                    echo "</div></div>
      ";
                }
                // line 57
                echo "      ";
                if (twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "state_province", [], "any", false, false, true, 57)) {
                    // line 58
                    echo "        <div class=\"webform-flex webform-flex--1 webform-address__province\"><div class=\"webform-flex--container\">";
                    echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "state_province", [], "any", false, false, true, 58), 58, $this->source), "html", null, true);
                    echo "</div></div>
      ";
                }
                // line 60
                echo "      ";
                if (twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "postal_code", [], "any", false, false, true, 60)) {
                    // line 61
                    echo "        <div class=\"webform-flex webform-flex--1 webform-address__postal-code\"><div class=\"webform-flex--container\">";
                    echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "postal_code", [], "any", false, false, true, 61), 61, $this->source), "html", null, true);
                    echo "</div></div>
      ";
                }
                // line 63
                echo "    </div>
  ";
            }
            // line 65
            echo "
  ";
            // line 66
            if (twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "country", [], "any", false, false, true, 66)) {
                // line 67
                echo "    <div class=\"webform-flexbox webform-contact__row-6\">
      <div class=\"webform-flex webform-flex--1 webform-address__country\"><div class=\"webform-flex--container\">";
                // line 68
                echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["content"] ?? null), "country", [], "any", false, false, true, 68), 68, $this->source), "html", null, true);
                echo "</div></div>
    </div>
  ";
            }
            // line 71
            echo "</div>
";
        } else {
            // line 73
            echo "  ";
            echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["content"] ?? null), 73, $this->source), "html", null, true);
            echo "
";
        }
    }

    public function getTemplateName()
    {
        return "modules/contrib/webform/templates/webform-composite-contact.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  183 => 73,  179 => 71,  173 => 68,  170 => 67,  168 => 66,  165 => 65,  161 => 63,  155 => 61,  152 => 60,  146 => 58,  143 => 57,  137 => 55,  135 => 54,  132 => 53,  130 => 52,  127 => 51,  121 => 48,  118 => 47,  116 => 46,  113 => 45,  107 => 42,  104 => 41,  102 => 40,  99 => 39,  95 => 37,  89 => 35,  86 => 34,  80 => 32,  78 => 31,  75 => 30,  73 => 29,  70 => 28,  66 => 26,  60 => 24,  57 => 23,  51 => 21,  49 => 20,  46 => 19,  44 => 18,  41 => 17,  39 => 16,);
    }

    public function getSourceContext()
    {
        return new Source("", "modules/contrib/webform/templates/webform-composite-contact.html.twig", "C:\\xampp\\htdocs\\les-bleuets-du-littorals\\school-project\\web\\modules\\contrib\\webform\\templates\\webform-composite-contact.html.twig");
    }
    
    public function checkSecurity()
    {
        static $tags = array("if" => 16);
        static $filters = array("escape" => 21);
        static $functions = array();

        try {
            $this->sandbox->checkSecurity(
                ['if'],
                ['escape'],
                []
            );
        } catch (SecurityError $e) {
            $e->setSourceContext($this->source);

            if ($e instanceof SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

    }
}
